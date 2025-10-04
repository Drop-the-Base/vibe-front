package com.example.uknf.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer id;

    @Column(name = "FullName", nullable = false, length = 150)
    private String fullName;

    @Column(name = "Email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "Organization", length = 150)
    private String organization;

    @ManyToOne
    @JoinColumn(name = "RoleID", nullable = false)
    private Roles role;

    @Column(name = "Status", length = 50)
    private String status = "Active";

    @Column(name = "LastLogin", columnDefinition = "datetime2")
    private OffsetDateTime lastLogin;

    @Column(name = "CreatedAt", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}

