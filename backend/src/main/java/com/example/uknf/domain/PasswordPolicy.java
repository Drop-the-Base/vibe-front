package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_policy")
public class PasswordPolicy extends BaseEntity {

    @Column(name = "min_length")
    private int minimumLength;

    @Column(name = "require_uppercase")
    private boolean requireUppercase;

    @Column(name = "require_lowercase")
    private boolean requireLowercase;

    @Column(name = "require_digit")
    private boolean requireDigit;

    @Column(name = "require_special")
    private boolean requireSpecial;

    @Column(name = "expire_days")
    private int expireAfterDays;

    @Column(name = "history_size")
    private int historySize;

    public int getMinimumLength() {
        return minimumLength;
    }

    public void setMinimumLength(int minimumLength) {
        this.minimumLength = minimumLength;
    }

    public boolean isRequireUppercase() {
        return requireUppercase;
    }

    public void setRequireUppercase(boolean requireUppercase) {
        this.requireUppercase = requireUppercase;
    }

    public boolean isRequireLowercase() {
        return requireLowercase;
    }

    public void setRequireLowercase(boolean requireLowercase) {
        this.requireLowercase = requireLowercase;
    }

    public boolean isRequireDigit() {
        return requireDigit;
    }

    public void setRequireDigit(boolean requireDigit) {
        this.requireDigit = requireDigit;
    }

    public boolean isRequireSpecial() {
        return requireSpecial;
    }

    public void setRequireSpecial(boolean requireSpecial) {
        this.requireSpecial = requireSpecial;
    }

    public int getExpireAfterDays() {
        return expireAfterDays;
    }

    public void setExpireAfterDays(int expireAfterDays) {
        this.expireAfterDays = expireAfterDays;
    }

    public int getHistorySize() {
        return historySize;
    }

    public void setHistorySize(int historySize) {
        this.historySize = historySize;
    }
}
