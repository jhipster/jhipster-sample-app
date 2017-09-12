package io.github.jhipster.sample.web.rest.errors;

import java.net.URI;

public final class ErrorConstants {

    public static final String ERR_CONCURRENCY_FAILURE = "error.concurrencyFailure";
    public static final String ERR_VALIDATION = "error.validation";
    public static final URI DEFAULT_TYPE = URI.create("http://www.jhipster.tech/problem/problem-with-message");
    public static final URI CONSTRAINT_VIOLATION_TYPE = URI.create("http://www.jhipster.tech/problem/contraint-violation");
    public static final URI PARAMETERIZED_TYPE = URI.create("http://www.jhipster.tech/problem/parameterized");

    private ErrorConstants() {
    }

}
