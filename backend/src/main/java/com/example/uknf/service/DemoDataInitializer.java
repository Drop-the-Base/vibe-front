package com.example.uknf.service;

import com.example.uknf.dto.*;
import com.example.uknf.model.enums.AccessRequestStatus;
import com.example.uknf.model.enums.CaseStatus;
import com.example.uknf.model.enums.MessageStatus;
import com.example.uknf.model.enums.PriorityLevel;
import com.example.uknf.model.enums.ReportStatus;
import com.example.uknf.model.enums.UserKind;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Component
public class DemoDataInitializer {
    private final UserService userService;
    private final EntityService entityService;
    private final ReportService reportService;
    private final MessageService messageService;
    private final CaseService caseService;
    private final AnnouncementService announcementService;
    private final FaqService faqService;
    private final AccessRequestService accessRequestService;
    private final RoleService roleService;
    private final ContactService contactService;
    private final LibraryService libraryService;

    public DemoDataInitializer(UserService userService,
                               EntityService entityService,
                               ReportService reportService,
                               MessageService messageService,
                               CaseService caseService,
                               AnnouncementService announcementService,
                               FaqService faqService,
                               AccessRequestService accessRequestService,
                               RoleService roleService,
                               ContactService contactService,
                               LibraryService libraryService) {
        this.userService = userService;
        this.entityService = entityService;
        this.reportService = reportService;
        this.messageService = messageService;
        this.caseService = caseService;
        this.announcementService = announcementService;
        this.faqService = faqService;
        this.accessRequestService = accessRequestService;
        this.roleService = roleService;
        this.contactService = contactService;
        this.libraryService = libraryService;
    }

    @PostConstruct
    public void seed() throws IOException {
        if (!userService.findAll().isEmpty()) {
            return;
        }

        // Roles
        roleService.create(new CreateRoleRequest("Administrator systemu", "Pełne uprawnienia", Set.of("USERS", "REQUESTS", "ROLES"), true));
        roleService.create(new CreateRoleRequest("Pracownik UKNF", "Obsługa sprawozdań i komunikacji", Set.of("REPORTS", "MESSAGES", "CASES"), false));

        // Users
        userService.ensureDemoUser("jan.kowalski@uknf.gov.pl", "Jan Kowalski", UserKind.INTERNAL_ADMIN, Set.of("USERS", "REPORTS"));
        userService.ensureDemoUser("anna.nowak@uknf.gov.pl", "Anna Nowak", UserKind.INTERNAL_STAFF, Set.of("REPORTS", "MESSAGES"));

        // Entities
        SupervisedEntityDto bank = entityService.create(new CreateEntityRequest(
                "Bank",
                "RIP100000",
                "Bank Przykładowy S.A.",
                "5493001KJTIIGC8Y1R12",
                "5252525252",
                "0000123456",
                "ul. Finansowa",
                "12",
                "3",
                "00-001",
                "Warszawa",
                "+48 22 123 45 67",
                "kontakt@bank.pl",
                "UKNF/2025/123",
                "Wpisany",
                "Banki komercyjne",
                "Banki",
                "Uniwersalne",
                false
        ), "system");

        SupervisedEntityDto insurer = entityService.create(new CreateEntityRequest(
                "Zakład Ubezpieczeń",
                "RIP200000",
                "Towarzystwo Ubezpieczeniowe XYZ",
                null,
                "7373737373",
                "0000222333",
                "ul. Bezpieczna",
                "4",
                null,
                "00-950",
                "Warszawa",
                "+48 22 987 65 43",
                "kontakt@ubezpieczenia.xyz",
                "UKNF/2024/456",
                "Wpisany",
                "Ubezpieczenia",
                "Towarzystwa",
                "Majątkowe",
                false
        ), "system");

        // Access requests demo
        CreateAccessRequestRequest req = new CreateAccessRequestRequest(
                "USR-000002",
                "Anna Nowak",
                "anna.nowak@uknf.gov.pl",
                "********1234",
                "+48 22 987 65 42",
                Set.of(bank.id()),
                Set.of("REPORTS", "CASES")
        );
        AccessRequestDto accessRequest = accessRequestService.toDto(accessRequestService.create(req, AccessRequestStatus.NEW));
        accessRequestService.updateStatus(accessRequest.id(), new UpdateAccessRequestStatusRequest(AccessRequestStatus.APPROVED, "Jan Kowalski", Instant.now(), "Przyznano dostęp"));

        // Reports
        ReportDto report = reportService.create(new CreateReportRequest(
                bank.id(),
                bank.name(),
                "Sprawozdanie kwartalne Q1 2025",
                "2025-Q1",
                "Sprawozdania kwartalne",
                Instant.now().plus(15, ChronoUnit.DAYS)
        ));
        reportService.updateStatus(report.id(), new UpdateReportStatusRequest(ReportStatus.VALIDATION_SUCCESS, Instant.now(), null, null));

        reportService.create(new CreateReportRequest(
                insurer.id(),
                insurer.name(),
                "Raport roczny 2024",
                "2024",
                "Sprawozdania roczne",
                Instant.now().plus(30, ChronoUnit.DAYS)
        ));

        // Library sample
        libraryService.storeFile(new InMemoryMultipartFile("harmonogram.xlsx", "Harmonogram".getBytes(StandardCharsets.UTF_8)),
                "Jan Kowalski", "Szablony", "public", List.of("sprawozdania"), "Wersja startowa");

        // Messages
        MessageThreadDto thread = messageService.createThread(new CreateMessageThreadRequest(
                "Wyjaśnienia do raportu",
                bank.id(),
                bank.name(),
                Set.of("USR-000001", "USR-000002"),
                new MessagePostRequest("USR-000001", "Jan Kowalski", "Prosimy o dodatkowe wyjaśnienia dotyczące pozycji 5.", true, null)
        ));
        messageService.postMessage(thread.id(), new MessagePostRequest("USR-000002", "Anna Nowak", "Wyjaśnienia przesłane w załączniku.", false, null), MessageStatus.WAITING_FOR_UKNF);

        // Cases
        CaseDto caseDto = caseService.create(new CreateCaseRequest(bank.id(), bank.name(), "Zmiana danych adresowych", "Zmiana danych rejestrowych", PriorityLevel.MEDIUM, "Anna Nowak", "Prosimy o aktualizację danych adresowych."));
        caseService.update(caseDto.id(), new UpdateCaseRequest(null, null, CaseStatus.IN_PROGRESS, null, "Jan Kowalski"));
        caseService.addNote(caseDto.id(), new CaseNoteRequest("Jan Kowalski", "Dane zweryfikowane, oczekujemy na dokumenty.", "comment"));

        // Announcements
        announcementService.create(new CreateAnnouncementRequest("Nowe terminy raportowania", "Dodano nowy harmonogram raportowania na Q2 2025", null, Instant.now().plus(60, ChronoUnit.DAYS), Set.of("BANKI"), true), "USR-000001");

        // FAQ
        FaqDto faq = faqService.createQuestion(new CreateFaqQuestionRequest("Jak podpisać sprawozdanie?", "Anna Nowak", "Sprawozdawczość", Set.of("sprawozdania", "podpis")));
        faqService.answerQuestion(faq.id(), new AnswerFaqRequest("Sprawozdania podpisujemy kwalifikowanym podpisem elektronicznym.", "Jan Kowalski", true));

        // Contacts & groups
        ContactDto contact = contactService.createContact(new CreateContactRequest("Piotr Wiśniewski", "piotr@ubezpieczenia.xyz", "+48 600 123 123", insurer.id()));
        contactService.createGroup(new CreateContactGroupRequest("Administratorzy banków", "Lista administratorów bankowych", Set.of(contact.id()), Set.of("USR-000001")));
    }

    private record InMemoryMultipartFile(String filename, byte[] content) implements MultipartFile {
        @Override
        public String getName() {
            return filename;
        }

        @Override
        public String getOriginalFilename() {
            return filename;
        }

        @Override
        public String getContentType() {
            return "application/octet-stream";
        }

        @Override
        public boolean isEmpty() {
            return content.length == 0;
        }

        @Override
        public long getSize() {
            return content.length;
        }

        @Override
        public byte[] getBytes() {
            return content;
        }

        @Override
        public ByteArrayInputStream getInputStream() {
            return new ByteArrayInputStream(content);
        }

        @Override
        public void transferTo(java.io.File dest) throws IOException {
            java.nio.file.Files.write(dest.toPath(), content);
        }
    }
}
