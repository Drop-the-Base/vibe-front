package com.example.uknf.web;

import com.example.uknf.domain.ActivityLog;
import com.example.uknf.domain.Announcement;
import com.example.uknf.domain.CaseRecord;
import com.example.uknf.domain.Message;
import com.example.uknf.domain.Report;
import com.example.uknf.repository.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ReportRepository reportRepository;
    private final MessageRepository messageRepository;
    private final AccessRequestRepository accessRequestRepository;
    private final AnnouncementRepository announcementRepository;
    private final SupervisedEntityRepository entityRepository;
    private final CaseRecordRepository caseRecordRepository;
    private final ActivityLogRepository activityLogRepository;

    public DashboardController(ReportRepository reportRepository,
                               MessageRepository messageRepository,
                               AccessRequestRepository accessRequestRepository,
                               AnnouncementRepository announcementRepository,
                               SupervisedEntityRepository entityRepository,
                               CaseRecordRepository caseRecordRepository,
                               ActivityLogRepository activityLogRepository) {
        this.reportRepository = reportRepository;
        this.messageRepository = messageRepository;
        this.accessRequestRepository = accessRequestRepository;
        this.announcementRepository = announcementRepository;
        this.entityRepository = entityRepository;
        this.caseRecordRepository = caseRecordRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public record DashboardOverview(
        long entities,
        long unreadMessages,
        long pendingRequests,
        long unreadAnnouncements,
        List<ReportTileDto> recentReports,
        List<CaseTileDto> recentCases,
        List<ActivityDto> recentActivities
    ) {
    }

    public record ReportTileDto(String id, String title, String entity, String status, String dueDate) {
    }

    public record CaseTileDto(String id, String title, String entity, String status, String priority) {
    }

    public record ActivityDto(String type, String description, String actor, String timestamp) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public DashboardOverview getOverview() {
        long entities = entityRepository.count();
        long unreadMessages = messageRepository.findAll().stream().filter(message -> message.getReadAt() == null).count();
        long pendingRequests = accessRequestRepository.findAll().stream()
            .filter(request -> request.getStatus().name().equalsIgnoreCase("NEW"))
            .count();
        long unreadAnnouncements = announcementRepository.findAll().stream()
            .filter(announcement -> announcement.isRequiresAcknowledgement())
            .count();

        List<ReportTileDto> reports = reportRepository.findAll().stream()
            .sorted(Comparator.comparing(Report::getCreatedAt).reversed())
            .limit(5)
            .map(report -> new ReportTileDto(
                report.getReportCode(),
                report.getTitle(),
                report.getEntity().getName(),
                report.getStatus().name().toLowerCase(),
                report.getDueDate() != null ? report.getDueDate().toString() : null
            ))
            .toList();

        List<CaseTileDto> cases = caseRecordRepository.findAll().stream()
            .sorted(Comparator.comparing(CaseRecord::getCreatedAt).reversed())
            .limit(3)
            .map(caseRecord -> new CaseTileDto(
                caseRecord.getCaseNumber(),
                caseRecord.getTitle(),
                caseRecord.getEntity().getName(),
                caseRecord.getStatus().name().toLowerCase(),
                caseRecord.getPriority().name().toLowerCase()
            ))
            .toList();

        List<ActivityDto> activities = activityLogRepository.findAll().stream()
            .sorted(Comparator.comparing(ActivityLog::getCreatedAt).reversed())
            .limit(6)
            .map(activity -> new ActivityDto(
                activity.getType(),
                activity.getDescription(),
                activity.getActor(),
                activity.getCreatedAt() != null ? activity.getCreatedAt().format(DATE_FORMAT) : null
            ))
            .toList();

        return new DashboardOverview(
            entities,
            unreadMessages,
            pendingRequests,
            unreadAnnouncements,
            reports,
            cases,
            activities
        );
    }
}
