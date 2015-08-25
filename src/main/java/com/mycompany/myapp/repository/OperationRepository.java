package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Operation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Operation entity.
 */
public interface OperationRepository extends JpaRepository<Operation,Long> {

    @Query("select distinct operation from Operation operation left join fetch operation.labels")
    List<Operation> findAllWithEagerRelationships();

    @Query("select operation from Operation operation left join fetch operation.labels where operation.id =:id")
    Operation findOneWithEagerRelationships(@Param("id") Long id);

}
