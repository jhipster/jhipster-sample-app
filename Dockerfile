FROM openjdk:8
ADD . /code/
RUN echo '{ "allow_root": true }' > /root/.bowerrc && \
    rm -Rf /code/target /code/node_modules && \
    cd /code/ && \
    ./mvnw clean package -Pprod -DskipTests && \
    mv /code/target/*.war /app.war

FROM openjdk:8-jre-alpine
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JHIPSTER_SLEEP=0 \
    JAVA_OPTS=""
EXPOSE 8080
CMD echo "The application will start in ${JHIPSTER_SLEEP}s..." && \
    sleep ${JHIPSTER_SLEEP} && \
    java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /app.war
COPY --from=0 /app.war .
