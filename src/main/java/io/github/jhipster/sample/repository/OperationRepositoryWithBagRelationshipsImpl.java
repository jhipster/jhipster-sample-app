package io.github.jhipster.sample.repository;

import io.github.jhipster.sample.domain.Operation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class OperationRepositoryWithBagRelationshipsImpl implements OperationRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String OPERATIONS_PARAMETER = "operations";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Operation> fetchBagRelationships(Optional<Operation> operation) {
        return operation.map(this::fetchLabels);
    }

    @Override
    public Page<Operation> fetchBagRelationships(Page<Operation> operations) {
        return new PageImpl<>(fetchBagRelationships(operations.getContent()), operations.getPageable(), operations.getTotalElements());
    }

    @Override
    public List<Operation> fetchBagRelationships(List<Operation> operations) {
        return Optional.of(operations).map(this::fetchLabels).orElse(Collections.emptyList());
    }

    Operation fetchLabels(Operation result) {
        return entityManager
            .createQuery(
                "select operation from Operation operation left join fetch operation.labels where operation.id = :id",
                Operation.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Operation> fetchLabels(List<Operation> operations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, operations.size()).forEach(index -> order.put(operations.get(index).getId(), index));
        List<Operation> result = entityManager
            .createQuery(
                "select operation from Operation operation left join fetch operation.labels where operation in :operations",
                Operation.class
            )
            .setParameter(OPERATIONS_PARAMETER, operations)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
