package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;


/**
 * A BankAccount.
 */
@Entity
@Table(name = "BANK_ACCOUNT")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class BankAccount implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    

    @NotNull        
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull        
    @Column(name = "balance", precision=10, scale=2, nullable = false)
    private BigDecimal balance;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "bankAccount")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Operation> operations = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Operation> getOperations() {
        return operations;
    }

    public void setOperations(Set<Operation> operations) {
        this.operations = operations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        BankAccount bankAccount = (BankAccount) o;

        if ( ! Objects.equals(id, bankAccount.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "BankAccount{" +
                "id=" + id +
                ", name='" + name + "'" +
                ", balance='" + balance + "'" +
                '}';
    }
}
