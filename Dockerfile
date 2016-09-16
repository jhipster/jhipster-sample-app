FROM openjdk:8

ENV JHIPSTER_SLEEP 0

# add source
ADD . /code/
# package the application and delete all lib
RUN echo '{ "allow_root": true }' > /root/.bowerrc && \
    cd /code/ && \
    ./mvnw clean package -Pprod -DskipTests && \
    mv /code/target/*.war /app.war && \
    rm -Rf /code /root/.npm/ /tmp && \
    rm -Rf /root/.m2/

RUN sh -c 'touch /app.war'
VOLUME /tmp
EXPOSE 8080
CMD echo "The application will start in ${JHIPSTER_SLEEP}s..." && \
    sleep ${JHIPSTER_SLEEP} && \
    java -Djava.security.egd=file:/dev/./urandom -jar /app.war
