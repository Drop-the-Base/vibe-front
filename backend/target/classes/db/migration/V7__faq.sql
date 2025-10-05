/* ============================================
   FAQ: kategorie, tagi, pytania, odpowiedzi, oceny
   MSSQL / snake_case / UTC timestamps
   ============================================ */

-- Kategorie (drzewo opcjonalne przez parent_category_id)
CREATE TABLE faq_categories (
                                category_id          INT IDENTITY(1,1) PRIMARY KEY,
                                name                 NVARCHAR(100) NOT NULL UNIQUE,
                                description          NVARCHAR(255),
                                parent_category_id   INT NULL,
                                CONSTRAINT fk_faq_categories_parent
                                    FOREIGN KEY (parent_category_id) REFERENCES faq_categories(category_id)
);

-- Tagi (etykiety)
CREATE TABLE faq_tags (
                          tag_id   INT IDENTITY(1,1) PRIMARY KEY,
                          name     NVARCHAR(50) NOT NULL UNIQUE
);

-- Pytania
CREATE TABLE faq_questions (
                               question_id     INT IDENTITY(1,1) PRIMARY KEY,
                               title           NVARCHAR(200) NOT NULL,
                               content         NVARCHAR(MAX) NOT NULL,
                               category_id     INT NOT NULL,
                               status          NVARCHAR(30) NOT NULL
        CONSTRAINT chk_faq_questions_status
        CHECK (status IN (N'new', N'in_review', N'answered', N'archived')),
                               created_at      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
                               updated_at      DATETIME2 NULL,
                               created_by      INT NULL,     -- FK do users.user_id (może być NULL dla anonimowych)
                               updated_by      INT NULL,
                               is_anonymous    BIT NOT NULL DEFAULT 0,
                               view_count      INT NOT NULL DEFAULT 0,
                               answer_count    INT NOT NULL DEFAULT 0,
                               deleted_at      DATETIME2 NULL,

                               CONSTRAINT fk_faq_questions_category
                                   FOREIGN KEY (category_id) REFERENCES faq_categories(category_id),

                               CONSTRAINT fk_faq_questions_created_by
                                   FOREIGN KEY (created_by) REFERENCES users(user_id),

                               CONSTRAINT fk_faq_questions_updated_by
                                   FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- Odpowiedzi (udzielane przez pracownik/administrator)
CREATE TABLE faq_answers (
                             answer_id       INT IDENTITY(1,1) PRIMARY KEY,
                             question_id     INT NOT NULL,
                             content         NVARCHAR(MAX) NOT NULL,
                             status          NVARCHAR(30) NOT NULL
        CONSTRAINT chk_faq_answers_status
        CHECK (status IN (N'draft', N'published', N'archived')),
                             category_id     INT NULL,  -- opcjonalnie, jeśli chcesz różnicować kategorie odpowiedzi
                             created_at      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
                             updated_at      DATETIME2 NULL,
                             created_by      INT NOT NULL,  -- pracownik UKNF / admin
                             updated_by      INT NULL,

    -- Pola pod oceny (agregaty)
                             rating_sum      INT NOT NULL DEFAULT 0,
                             rating_count    INT NOT NULL DEFAULT 0,
                             rating_avg AS (CASE WHEN [rating_count] = 0 THEN NULL
                        ELSE CAST([rating_sum] AS DECIMAL(9,2)) / NULLIF([rating_count], 0) END) PERSISTED,

                             CONSTRAINT fk_faq_answers_question
                                 FOREIGN KEY (question_id) REFERENCES faq_questions(question_id) ON DELETE CASCADE,

                             CONSTRAINT fk_faq_answers_category
                                 FOREIGN KEY (category_id) REFERENCES faq_categories(category_id),

                             CONSTRAINT fk_faq_answers_created_by
                                 FOREIGN KEY (created_by) REFERENCES users(user_id),

                             CONSTRAINT fk_faq_answers_updated_by
                                 FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- Powiązania pytanie↔tag
CREATE TABLE faq_question_tags (
                                   question_id INT NOT NULL,
                                   tag_id      INT NOT NULL,
                                   CONSTRAINT pk_faq_question_tags PRIMARY KEY (question_id, tag_id),
                                   CONSTRAINT fk_faq_question_tags_q
                                       FOREIGN KEY (question_id) REFERENCES faq_questions(question_id) ON DELETE CASCADE,
                                   CONSTRAINT fk_faq_question_tags_t
                                       FOREIGN KEY (tag_id) REFERENCES faq_tags(tag_id)
);

-- (opcjonalnie) Powiązania odpowiedź↔tag (jeśli chcesz tagować też odpowiedzi)
CREATE TABLE faq_answer_tags (
                                 answer_id  INT NOT NULL,
                                 tag_id     INT NOT NULL,
                                 CONSTRAINT pk_faq_answer_tags PRIMARY KEY (answer_id, tag_id),
                                 CONSTRAINT fk_faq_answer_tags_a
                                     FOREIGN KEY (answer_id) REFERENCES faq_answers(answer_id) ON DELETE CASCADE,
                                 CONSTRAINT fk_faq_answer_tags_t
                                     FOREIGN KEY (tag_id) REFERENCES faq_tags(tag_id)
);

-- Oceny odpowiedzi (1–5 gwiazdek)
CREATE TABLE faq_answer_ratings (
                                    rating_id   INT IDENTITY(1,1) PRIMARY KEY,
                                    answer_id   INT NOT NULL,
                                    user_id     INT NULL,      -- oceniający (może być NULL dla anonima)
                                    rating      TINYINT NOT NULL
                                        CONSTRAINT chk_faq_answer_rating CHECK (rating BETWEEN 1 AND 5),
                                    comment     NVARCHAR(500) NULL,
                                    created_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

                                    CONSTRAINT fk_faq_answer_ratings_answer
                                        FOREIGN KEY (answer_id) REFERENCES faq_answers(answer_id) ON DELETE CASCADE,

                                    CONSTRAINT fk_faq_answer_ratings_user
                                        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Unikalna ocena per użytkownik dla danej odpowiedzi (anonimowi mogą oceniać wielokrotnie)
CREATE UNIQUE INDEX ux_faq_answer_ratings_answer_user
    ON faq_answer_ratings (answer_id, user_id)
    WHERE user_id IS NOT NULL;

-- =========================================
-- Indeksy pod wyszukiwanie i sortowanie
-- =========================================

-- Pytania: po tytule, kategorii i statusie
CREATE INDEX ix_faq_questions_title
    ON faq_questions (title);

CREATE INDEX ix_faq_questions_category_status
    ON faq_questions (category_id, status);

-- Popularność: po view_count, created_at
CREATE INDEX ix_faq_questions_popularity
    ON faq_questions (view_count DESC, created_at DESC);

-- Odpowiedzi: po pytaniu, statusie i ocenie
CREATE INDEX ix_faq_answers_question_status
    ON faq_answers (question_id, status);

CREATE INDEX ix_faq_answers_rating
    ON faq_answers (rating_avg DESC, rating_count DESC);

-- Tagging: filtrowanie po tagach
CREATE INDEX ix_faq_question_tags_tag
    ON faq_question_tags (tag_id);

CREATE INDEX ix_faq_answer_tags_tag
    ON faq_answer_tags (tag_id);

/* =========================================
   (Opcjonalnie) Full-Text Search
   Odkomentuj, jeśli masz włączoną usługę FTS
   =========================================
-- CREATE FULLTEXT CATALOG ftc_faq AS DEFAULT;
-- CREATE FULLTEXT INDEX ON faq_questions (title LANGUAGE 1045, content LANGUAGE 1045) KEY INDEX PK__faq_ques__...;
-- CREATE FULLTEXT INDEX ON faq_answers (content LANGUAGE 1045) KEY INDEX PK__faq_answ__...;
*/
