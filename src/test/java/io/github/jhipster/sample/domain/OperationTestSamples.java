package io.github.jhipster.sample.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OperationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Operation getOperationSample1() {
        return new Operation().id(1L).description("description1");
    }

    public static Operation getOperationSample2() {
        return new Operation().id(2L).description("description2");
    }

    public static Operation getOperationRandomSampleGenerator() {
        return new Operation().id(longCount.incrementAndGet()).description(UUID.randomUUID().toString());
    }
}
