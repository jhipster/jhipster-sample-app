package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonManagedReference;

/**
 * A project. Eventually create a base class for Test that can be extensible for
 * example by RestTest or CustomTest and so on
 * 
 */
@Entity
@Table(name = "T_TEST_HISTORY")
// @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(Include.NON_NULL)
public class TestHistory implements Serializable {

	@Id
	// @GeneratedValue(generator="system-uuid")
	// @GenericGenerator(name="system-uuid", strategy="uuid")
	@Column(name = "test_history_id")
	private UUID testHistoryId;

	@ManyToOne
	@JoinColumn(name = "test_id")
	private Test test;

	@OneToOne(cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	@JsonManagedReference
	private TestResult testResult;
	
	@Temporal(TemporalType.TIME)
	@Column(name = "schedule_time")
	private Date scheduleTime;

	@Temporal(TemporalType.TIME)
	@Column(name = "start_time")
	private Date startTime;

	@Temporal(TemporalType.TIME)
	@Column(name = "end_time")
	private Date endTime;

	@Column(name = "execution_time_in_ms")
	private Long executionTimeInMs;

	@Column(name = "exception")
	@Size(max = 5000)
	private String exception;

	public UUID getTestHistoryId() {
		return testHistoryId;
	}

	public void setTestHistoryId(UUID testHistoryId) {
		this.testHistoryId = testHistoryId;
	}

	public Test getTest() {
		return test;
	}

	public void setTest(Test test) {
		this.test = test;
	}

	public Date getScheduleTime() {
		return scheduleTime;
	}

	public void setScheduleTime(Date scheduleTime) {
		this.scheduleTime = scheduleTime;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public Long getExecutionTimeInMs() {
		return executionTimeInMs;
	}

	public void setExecutionTimeInMs(Long executionTimeInMs) {
		this.executionTimeInMs = executionTimeInMs;
	}

	public String getException() {
		return exception;
	}

	public void setException(String exception) {
		this.exception = exception;
	}
	
	

}
