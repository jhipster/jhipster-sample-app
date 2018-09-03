package io.github.jhipster.sample.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.sample.domain.BankAccount;
import io.github.jhipster.sample.repository.BankAccountRepository;
import io.github.jhipster.sample.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.sample.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing BankAccount.
 */
@RestController
@RequestMapping("/api")
public class BankAccountResource {

    private final Logger log = LoggerFactory.getLogger(BankAccountResource.class);

    private static final String ENTITY_NAME = "bankAccount";

    private final BankAccountRepository bankAccountRepository;

    public BankAccountResource(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    /**
     * POST  /bank-accounts : Create a new bankAccount.
     *
     * @param bankAccount the bankAccount to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bankAccount, or with status 400 (Bad Request) if the bankAccount has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/bank-accounts")
    @Timed
    public ResponseEntity<BankAccount> createBankAccount(@Valid @RequestBody BankAccount bankAccount) throws URISyntaxException {
        log.debug("REST request to save BankAccount : {}", bankAccount);
        if (bankAccount.getId() != null) {
            throw new BadRequestAlertException("A new bankAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BankAccount result = bankAccountRepository.save(bankAccount);
        return ResponseEntity.created(new URI("/api/bank-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /bank-accounts : Updates an existing bankAccount.
     *
     * @param bankAccount the bankAccount to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bankAccount,
     * or with status 400 (Bad Request) if the bankAccount is not valid,
     * or with status 500 (Internal Server Error) if the bankAccount couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/bank-accounts")
    @Timed
    public ResponseEntity<BankAccount> updateBankAccount(@Valid @RequestBody BankAccount bankAccount) throws URISyntaxException {
        log.debug("REST request to update BankAccount : {}", bankAccount);
        if (bankAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BankAccount result = bankAccountRepository.save(bankAccount);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, bankAccount.getId().toString()))
            .body(result);
    }

    /**
     * GET  /bank-accounts : get all the bankAccounts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of bankAccounts in body
     */
    @GetMapping("/bank-accounts")
    @Timed
    public List<BankAccount> getAllBankAccounts() {
        log.debug("REST request to get all BankAccounts");
        return bankAccountRepository.findAll();
    }

    /**
     * GET  /bank-accounts/:id : get the "id" bankAccount.
     *
     * @param id the id of the bankAccount to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bankAccount, or with status 404 (Not Found)
     */
    @GetMapping("/bank-accounts/{id}")
    @Timed
    public ResponseEntity<BankAccount> getBankAccount(@PathVariable Long id) {
        log.debug("REST request to get BankAccount : {}", id);
        Optional<BankAccount> bankAccount = bankAccountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bankAccount);
    }

    /**
     * DELETE  /bank-accounts/:id : delete the "id" bankAccount.
     *
     * @param id the id of the bankAccount to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/bank-accounts/{id}")
    @Timed
    public ResponseEntity<Void> deleteBankAccount(@PathVariable Long id) {
        log.debug("REST request to delete BankAccount : {}", id);

        bankAccountRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
