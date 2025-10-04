package com.example.uknf.services;

import com.example.uknf.entities.MessageAttachment;
import com.example.uknf.repositories.MessageAttachmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AttachmentService {

    private final MessageAttachmentRepository repo;

    // base dir where attachments will be stored; configurable
    @Value("${app.attachments.dir:uploads/message_attachments}")
    private String attachmentsBaseDir;

    public AttachmentService(MessageAttachmentRepository repo) {
        this.repo = repo;
    }

    public MessageAttachment save(Long messageId, MultipartFile file) throws IOException {
        // ensure base dir exists
        Path base = Path.of(attachmentsBaseDir);
        Files.createDirectories(base);

        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String unique = UUID.randomUUID().toString() + "_" + original;
        Path target = base.resolve(unique);

        // stream to disk
        try (var in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        var att = new MessageAttachment();
        att.setMessageId(messageId);
        att.setFileName(original);
        att.setContentType(file.getContentType());
        att.setFileSize(file.getSize());
        att.setStoragePath(target.toAbsolutePath().toString());

        return repo.save(att);
    }

    @Transactional(readOnly = true)
    public List<MessageAttachment> listForMessage(Long messageId) {
        return repo.findByMessageId(messageId);
    }

    @Transactional(readOnly = true)
    public MessageAttachment findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Attachment not found: id=" + id));
    }
}
