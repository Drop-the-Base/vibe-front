import { apiClient } from '../../../shared/api/api-client';
import type { FaqCategory, FaqItem } from '../types/faq';

interface HalLink {
  href: string;
}

interface FaqQuestionResource {
  id?: number | string;
  title?: string;
  content?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  anonymous?: boolean;
  viewCount?: number;
  answerCount?: number;
  _links?: {
    self?: HalLink;
    category?: HalLink;
    answers?: HalLink;
  };
}

interface FaqAnswerResource {
  id?: number | string;
  content?: string;
  status?: string;
  createdAt?: string;
  ratingSum?: number;
  ratingCount?: number;
  _links?: {
    self?: HalLink;
    question?: HalLink;
  };
}

interface FaqCategoryResource {
  id?: number | string;
  name?: string;
  description?: string;
}

interface HalCollection<T> {
  _embedded?: Record<string, T[]>;
}

const HAL_FAQ_QUESTIONS_KEY = 'faq-questions';
const HAL_FAQ_ANSWERS_KEY = 'faq-answers';
const HAL_FAQ_CATEGORIES_KEY = 'faq-categories';
const DEFAULT_CATEGORY = 'Inne';

const cache = new Map<string, any>();

const toRelativePath = (href?: string) => {
  if (!href) {
    return undefined;
  }
  try {
    const normalized = new URL(href);
    return normalized.pathname + normalized.search;
  } catch (error) {
    return href.startsWith('/') ? href : `/${href}`;
  }
};

const extractEmbedded = <T>(collection: HalCollection<T>, key: string): T[] => {
  if (!collection || !collection._embedded) {
    return [];
  }
  const value = collection._embedded[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value;
};

const fetchCachedResource = async <T>(href?: string): Promise<T | undefined> => {
  const relative = toRelativePath(href);
  if (!relative) {
    return undefined;
  }

  if (cache.has(relative)) {
    return cache.get(relative) as T;
  }

  try {
    const resource = (await apiClient.get<T>(relative)) as T;
    cache.set(relative, resource);
    return resource;
  } catch (error) {
    return undefined;
  }
};

const mapQuestion = async (
  resource: FaqQuestionResource,
  answersByQuestion: Map<string, FaqAnswerResource[]>,
): Promise<FaqItem> => {
  const selfHref = toRelativePath(resource._links?.self?.href) ?? `faq-questions/${resource.id ?? crypto.randomUUID()}`;
  const answers = answersByQuestion.get(selfHref) ?? [];

  const publishedAnswer = answers.find((answer) => answer.status?.toLowerCase() === 'published');
  const fallbackAnswer = answers[0];
  const answerToDisplay = publishedAnswer ?? fallbackAnswer;

  const categoryResource = (await fetchCachedResource<{ name?: string }>(resource._links?.category?.href)) ?? {};
  const categoryName = (categoryResource.name?.trim() || DEFAULT_CATEGORY) as string;

  const helpful = answerToDisplay?.ratingCount ?? answerToDisplay?.ratingSum ?? 0;

  return {
    id: String(resource.id ?? selfHref),
    question: resource.title ?? 'Brak tytułu',
    answer: answerToDisplay?.content ?? 'Brak opublikowanej odpowiedzi dla tego pytania.',
    category: categoryName,
    answeredBy: 'Pracownik UKNF',
    askedBy: resource.anonymous ? 'Anonim' : undefined,
    date: answerToDisplay?.createdAt ?? resource.createdAt,
    helpful,
  };
};

const buildAnswersMap = (answers: FaqAnswerResource[]): Map<string, FaqAnswerResource[]> => {
  const map = new Map<string, FaqAnswerResource[]>();

  answers.forEach((answer) => {
    const questionHref = toRelativePath(answer._links?.question?.href);
    if (!questionHref) {
      return;
    }

    const current = map.get(questionHref) ?? [];
    current.push(answer);
    map.set(questionHref, current);
  });

  return map;
};

export const fetchFaqItems = async (): Promise<FaqItem[]> => {
  const [questionsResponse, answersResponse] = await Promise.all([
    apiClient.get<HalCollection<FaqQuestionResource>>('/faq-questions'),
    apiClient.get<HalCollection<FaqAnswerResource>>('/faq-answers'),
  ]);

  const questionResources = extractEmbedded(questionsResponse, HAL_FAQ_QUESTIONS_KEY);
  const answerResources = extractEmbedded(answersResponse, HAL_FAQ_ANSWERS_KEY);

  const answersByQuestion = buildAnswersMap(answerResources);

  const items = await Promise.all(
    questionResources.map((question) => mapQuestion(question, answersByQuestion)),
  );

  return items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
};

export const fetchFaqCategories = async (): Promise<FaqCategory[]> => {
  const response = await apiClient.get<any>('/faq-categories');
  const resources: FaqCategoryResource[] =
    response ?? [];

  console.log('Fetched categories:', response);

  return resources
    .map((category) => {
      return {
        id: category.id,
        name: category.name ?? DEFAULT_CATEGORY,
        description: category.description ?? undefined,
      } satisfies FaqCategory;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'));
};

interface CreateFaqQuestionInput {
  title: string;
  content: string;
  categoryLink: string;
  anonymous?: boolean;
}

export const createFaqQuestion = async ({
  title,
  content,
  categoryLink,
  anonymous = false,
}: CreateFaqQuestionInput) => {
  const payload = {
    title,
    content,
    status: 'new',
    anonymous,
    category: categoryLink,
  };

  cache.clear();
  return apiClient.post('/faq-questions', payload);
};
