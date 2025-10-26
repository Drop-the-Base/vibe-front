package com.example.uknf.config;

import com.example.uknf.domain.*;
import com.example.uknf.domain.enums.*;
import com.example.uknf.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner seedData(
        SupervisedEntityRepository entityRepository,
        AppUserRepository userRepository,
        ReportRepository reportRepository,
        MessageThreadRepository messageThreadRepository,
        MessageRepository messageRepository,
        CaseRecordRepository caseRepository,
        LibraryFileRepository libraryFileRepository,
        AnnouncementRepository announcementRepository,
        FaqCategoryRepository faqCategoryRepository,
        FaqQuestionRepository faqQuestionRepository,
        FaqAnswerRepository faqAnswerRepository,
        AccessRequestRepository accessRequestRepository,
        RoleDefinitionRepository roleDefinitionRepository,
        PasswordPolicyRepository passwordPolicyRepository,
        ActivityLogRepository activityLogRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (entityRepository.count() > 0) {
                return;
            }

            SupervisedEntity bank = new SupervisedEntity();
            bank.setName("Bank Przykładowy S.A.");
            bank.setType("Bank");
            bank.setUknfCode("RIP100000");
            bank.setNip("5252525252");
            bank.setStatus("Wpisany");
            bank.setCategory("Instytucja bankowa");
            bank.setSector("Bankowy");
            bank.setSubsector("Komercyjny");
            bank.setPhone("+48 22 123 45 67");
            bank.setEmail("kontakt@bankprzykladowy.pl");
            bank.setContactPerson("Maria Nowak");
            bank.setStreet("ul. Finansowa");
            bank.setBuildingNumber("1");
            bank.setPostalCode("00-001");
            bank.setCity("Warszawa");

            SupervisedEntity insurer = new SupervisedEntity();
            insurer.setName("Towarzystwo Ubezpieczeniowe XYZ");
            insurer.setType("Zakład Ubezpieczeń");
            insurer.setUknfCode("INS200000");
            insurer.setNip("7373737373");
            insurer.setStatus("Wpisany");
            insurer.setCategory("Ubezpieczeniowy");
            insurer.setSector("Ubezpieczenia");
            insurer.setSubsector("Ogólne");
            insurer.setPhone("+48 22 987 65 43");
            insurer.setEmail("kontakt@tu-xyz.pl");
            insurer.setContactPerson("Piotr Wiśniewski");
            insurer.setStreet("ul. Bezpieczna");
            insurer.setBuildingNumber("5");
            insurer.setPostalCode("00-950");
            insurer.setCity("Warszawa");

            entityRepository.saveAll(List.of(bank, insurer));

            AppUser internal = new AppUser();
            internal.setFirstName("Jan");
            internal.setLastName("Kowalski");
            internal.setEmail("jan.kowalski@uknf.gov.pl");
            internal.setPhone("+48 22 500 00 00");
            internal.setRoleType(UserRoleType.INTERNAL);
            internal.setRoleName("Pracownik UKNF");
            internal.setPasswordHash(passwordEncoder.encode("P@ssw0rd!"));
            internal.getPermissions().addAll(Set.of("REPORTS_VIEW", "MESSAGES_MANAGE", "CASES_MANAGE"));
            internal.setLastLogin(OffsetDateTime.now().minusDays(1));

            AppUser externalAdmin = new AppUser();
            externalAdmin.setFirstName("Maria");
            externalAdmin.setLastName("Nowak");
            externalAdmin.setEmail("maria.nowak@bankprzykladowy.pl");
            externalAdmin.setPhone("+48 22 500 00 01");
            externalAdmin.setRoleType(UserRoleType.EXTERNAL);
            externalAdmin.setRoleName("Administrator podmiotu");
            externalAdmin.setPasswordHash(passwordEncoder.encode("P@ssw0rd!"));
            externalAdmin.getPermissions().addAll(Set.of("REPORTS_SUBMIT", "CASES_CREATE"));
            externalAdmin.getEntities().add(bank);
            externalAdmin.setLastLogin(OffsetDateTime.now().minusHours(5));

            userRepository.saveAll(List.of(internal, externalAdmin));

            RoleDefinition analyst = new RoleDefinition();
            analyst.setRoleName("Analityk sprawozdań");
            analyst.setDescription("Odpowiada za przegląd i walidację sprawozdań");
            analyst.getPermissions().addAll(Set.of("REPORTS_VIEW", "REPORTS_VALIDATE"));

            RoleDefinition caseOfficer = new RoleDefinition();
            caseOfficer.setRoleName("Opiekun spraw");
            caseOfficer.setDescription("Zarządza sprawami podmiotów");
            caseOfficer.getPermissions().addAll(Set.of("CASES_VIEW", "CASES_MANAGE"));

            roleDefinitionRepository.saveAll(List.of(analyst, caseOfficer));

            PasswordPolicy policy = new PasswordPolicy();
            policy.setMinimumLength(12);
            policy.setRequireUppercase(true);
            policy.setRequireLowercase(true);
            policy.setRequireDigit(true);
            policy.setRequireSpecial(true);
            policy.setExpireAfterDays(90);
            policy.setHistorySize(8);
            passwordPolicyRepository.save(policy);

            Report q1Report = new Report();
            q1Report.setReportCode("RPT-2025-Q1");
            q1Report.setTitle("Sprawozdanie kwartalne Q1 2025");
            q1Report.setType("Sprawozdanie kwartalne");
            q1Report.setStatus(ReportStatus.IN_VALIDATION);
            q1Report.setEntity(bank);
            q1Report.setDueDate(LocalDate.now().plusDays(15));
            q1Report.setSubmissionDate(OffsetDateTime.now().minusDays(2));
            q1Report.setAssignedTo("Jan Kowalski");
            q1Report.setValidationSummary("Automatyczna walidacja wykryła 2 ostrzeżenia dotyczące brakujących pól.");
            q1Report.getValidationErrors().add("Brak wartości w kolumnie 5 - sekcja aktywa");

            Report q2Report = new Report();
            q2Report.setReportCode("RPT-2025-Q2");
            q2Report.setTitle("Sprawozdanie kwartalne Q2 2025");
            q2Report.setType("Sprawozdanie kwartalne");
            q2Report.setStatus(ReportStatus.VALIDATION_SUCCESS);
            q2Report.setEntity(bank);
            q2Report.setDueDate(LocalDate.now().plusDays(45));
            q2Report.setSubmissionDate(OffsetDateTime.now().minusDays(10));
            q2Report.setAssignedTo("Jan Kowalski");
            q2Report.setValidationSummary("Walidacja zakończona sukcesem.");

            Report annual = new Report();
            annual.setReportCode("RPT-2024-ANN");
            annual.setTitle("Sprawozdanie roczne 2024");
            annual.setType("Sprawozdanie roczne");
            annual.setStatus(ReportStatus.VALIDATION_ERRORS);
            annual.setEntity(insurer);
            annual.setDueDate(LocalDate.now().plusDays(30));
            annual.setSubmissionDate(OffsetDateTime.now().minusDays(1));
            annual.setAssignedTo("Anna Nowicka");
            annual.setValidationSummary("Wykryto błędy merytoryczne wymagające korekty");
            annual.getValidationErrors().add("Nieprawidłowa suma pozycji w tabeli 3");

            reportRepository.saveAll(List.of(q1Report, q2Report, annual));

            MessageThread generalThread = new MessageThread();
            generalThread.setThreadKey("MSG-001");
            generalThread.setSubject("Wyjaśnienie dot. sprawozdania RPT-2025-Q1");
            generalThread.setEntity(bank);
            messageThreadRepository.save(generalThread);

            Message firstMessage = new Message();
            firstMessage.setThread(generalThread);
            firstMessage.setEntity(bank);
            firstMessage.setSubject(generalThread.getSubject());
            firstMessage.setContent("Prosimy o wyjaśnienie różnic w kapitale własnym za Q1");
            firstMessage.setSender("Jan Kowalski");
            firstMessage.setSenderRole("Analityk");
            firstMessage.setSenderType("INTERNAL");
            firstMessage.setRecipient("Maria Nowak");
            firstMessage.setRecipientRole("Administrator podmiotu");
            firstMessage.setRecipientType("EXTERNAL");
            firstMessage.setDirection(MessageDirection.OUTBOUND);
            firstMessage.setStatus(MessageStatus.AWAITING_USER);
            firstMessage.setHasAttachments(false);
            messageRepository.save(firstMessage);

            Message reply = new Message();
            reply.setThread(generalThread);
            reply.setEntity(bank);
            reply.setSubject("Re: " + generalThread.getSubject());
            reply.setContent("W załączeniu przesyłamy korektę danych finansowych.");
            reply.setSender("Maria Nowak");
            reply.setSenderRole("Administrator podmiotu");
            reply.setSenderType("EXTERNAL");
            reply.setRecipient("Jan Kowalski");
            reply.setRecipientRole("Analityk");
            reply.setRecipientType("INTERNAL");
            reply.setDirection(MessageDirection.INBOUND);
            reply.setStatus(MessageStatus.AWAITING_UKNF);
            reply.setHasAttachments(true);
            reply.setReplyToId(firstMessage.getId());
            messageRepository.save(reply);

            CaseRecord caseRecord = new CaseRecord();
            caseRecord.setCaseNumber("CASE-2025-001");
            caseRecord.setTitle("Zmiana danych rejestrowych - Bank Przykładowy");
            caseRecord.setStatus(CaseStatus.IN_PROGRESS);
            caseRecord.setPriority(CasePriority.HIGH);
            caseRecord.setEntity(bank);
            caseRecord.setAssignedTo("Piotr Zieliński");
            caseRecord.setDescription("Podmiot zgłosił zmianę adresu siedziby. Weryfikacja w toku.");
            caseRecord.setLastUpdated(OffsetDateTime.now().minusHours(3));
            caseRepository.save(caseRecord);

            LibraryFile template = new LibraryFile();
            template.setName("Szablon sprawozdania kwartalnego");
            template.setType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            template.setCategory("Sprawozdania");
            template.setVersion("2025.1");
            template.setUploadedBy("Jan Kowalski");
            template.setUploadedAt(OffsetDateTime.now().minusDays(7));
            template.setSizeBytes(1024 * 120);
            template.setTags("sprawozdanie, szablon, kwartalny");
            template.setAccessLevel("public");
            template.setFilePath("uploads/template.xlsx");
            libraryFileRepository.save(template);

            Announcement announcement = new Announcement();
            announcement.setTitle("Nowe wytyczne dotyczące raportowania ESG");
            announcement.setContent("Od 1 listopada obowiązują zaktualizowane wytyczne dotyczące raportowania wskaźników ESG.");
            announcement.setPriority(AnnouncementPriority.HIGH);
            announcement.setTarget("all");
            announcement.setPublishedAt(OffsetDateTime.now().minusDays(1));
            announcement.setExpiresAt(OffsetDateTime.now().plusDays(14));
            announcement.setRequiresAcknowledgement(true);
            announcement.getRecipients().addAll(Set.of("RIP100000", "INS200000"));
            announcement.getReadBy().add("jan.kowalski@uknf.gov.pl");
            announcementRepository.save(announcement);

            FaqCategory reportingCat = new FaqCategory();
            reportingCat.setName("Sprawozdawczość");
            reportingCat.setDescription("Pytania i odpowiedzi dotyczące sprawozdań");
            faqCategoryRepository.save(reportingCat);

            FaqQuestion question = new FaqQuestion();
            question.setTitle("Jak przesłać korektę sprawozdania?");
            question.setContent("Korektę sprawozdania można przesłać korzystając z modułu Sprawozdania. Wybierz opcję \"Dodaj korektę\".");
            question.setStatus("published");
            question.setAnonymous(false);
            question.setViewCount(120);
            question.setAnswerCount(1);
            question.setCategory(reportingCat);
            faqQuestionRepository.save(question);

            FaqAnswer answer = new FaqAnswer();
            answer.setQuestion(question);
            answer.setContent("Po zalogowaniu wybierz sprawozdanie i skorzystaj z przycisku \"Dodaj korektę\". Dołącz plik z poprawionymi danymi.");
            answer.setStatus("published");
            answer.setRatingCount(12);
            answer.setRatingSum(50);
            faqAnswerRepository.save(answer);

            AccessRequest request = new AccessRequest();
            request.setUser(externalAdmin);
            request.setEntity(bank);
            request.setStatus(AccessRequestStatus.NEW);
            request.getRequestedPermissions().addAll(Set.of("REPORTS_SUBMIT", "CASES_VIEW"));
            request.setSubmittedAt(OffsetDateTime.now().minusDays(2));
            request.setReviewedBy("Jan Kowalski");
            request.setReviewedAt(OffsetDateTime.now().minusDays(1));
            accessRequestRepository.save(request);

            ActivityLog activity1 = new ActivityLog();
            activity1.setType("report");
            activity1.setDescription("Złożono sprawozdanie RPT-2025-Q1 przez Bank Przykładowy S.A.");
            activity1.setActor("Maria Nowak");

            ActivityLog activity2 = new ActivityLog();
            activity2.setType("announcement");
            activity2.setDescription("Opublikowano komunikat: Nowe wytyczne dotyczące raportowania ESG");
            activity2.setActor("Jan Kowalski");

            ActivityLog activity3 = new ActivityLog();
            activity3.setType("case");
            activity3.setDescription("Zmieniono status sprawy CASE-2025-001 na IN_PROGRESS");
            activity3.setActor("Piotr Zieliński");

            activityLogRepository.saveAll(List.of(activity1, activity2, activity3));
        };
    }
}
