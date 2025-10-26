package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "supervised_entities")
public class SupervisedEntity extends BaseEntity {

    @Column(name = "entity_type", length = 250)
    private String type;

    @Column(name = "uknf_code", length = 250, unique = true)
    private String uknfCode;

    @Column(name = "name", length = 500, nullable = false)
    private String name;

    @Column(name = "lei", length = 20)
    private String lei;

    @Column(name = "nip", length = 10)
    private String nip;

    @Column(name = "krs", length = 10)
    private String krs;

    @Column(name = "street", length = 250)
    private String street;

    @Column(name = "building_number", length = 250)
    private String buildingNumber;

    @Column(name = "flat_number", length = 250)
    private String flatNumber;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "city", length = 250)
    private String city;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "email", length = 500)
    private String email;

    @Column(name = "contact_person", length = 250)
    private String contactPerson;

    @Column(name = "register_number", length = 100)
    private String registerNumber;

    @Column(name = "status", length = 250)
    private String status;

    @Column(name = "category", length = 500)
    private String category;

    @Column(name = "sector", length = 500)
    private String sector;

    @Column(name = "subsector", length = 500)
    private String subsector;

    @Column(name = "cross_border")
    private boolean crossBorder;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUknfCode() {
        return uknfCode;
    }

    public void setUknfCode(String uknfCode) {
        this.uknfCode = uknfCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLei() {
        return lei;
    }

    public void setLei(String lei) {
        this.lei = lei;
    }

    public String getNip() {
        return nip;
    }

    public void setNip(String nip) {
        this.nip = nip;
    }

    public String getKrs() {
        return krs;
    }

    public void setKrs(String krs) {
        this.krs = krs;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getBuildingNumber() {
        return buildingNumber;
    }

    public void setBuildingNumber(String buildingNumber) {
        this.buildingNumber = buildingNumber;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getSubsector() {
        return subsector;
    }

    public void setSubsector(String subsector) {
        this.subsector = subsector;
    }

    public boolean isCrossBorder() {
        return crossBorder;
    }

    public void setCrossBorder(boolean crossBorder) {
        this.crossBorder = crossBorder;
    }
}
