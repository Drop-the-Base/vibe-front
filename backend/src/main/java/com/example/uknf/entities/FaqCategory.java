package com.example.uknf.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "faq_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_category_id")
    private FaqCategory parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<FaqCategory> children;
}
