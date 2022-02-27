package io.github.jhipster.sample.repository;

import io.github.jhipster.sample.domain.Operation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface OperationRepositoryWithBagRelationships {
    Optional<Operation> fetchBagRelationships(Optional<Operation> operation);

    List<Operation> fetchBagRelationships(List<Operation> operations);

    Page<Operation> fetchBagRelationships(Page<Operation> operations);
}
