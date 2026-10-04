package com.wisla.task_manager_api.service;

import com.wisla.task_manager_api.dto.CreateTaskRequestDto;
import com.wisla.task_manager_api.dto.TaskResponseDto;
import com.wisla.task_manager_api.dto.UpdateTaskCompletionRequestDto;
import com.wisla.task_manager_api.dto.UpdateTaskRequestDto;
import com.wisla.task_manager_api.exception.ResourceNotFoundException;
import com.wisla.task_manager_api.mapper.TaskMapper;
import com.wisla.task_manager_api.model.Task;
import com.wisla.task_manager_api.repository.TaskRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository repository;
    private final TaskMapper mapper;

    public TaskService(TaskRepository repository, TaskMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<TaskResponseDto> findAll() {
        return repository
                .findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(mapper::toResponse)
                .toList();
    }


    public TaskResponseDto findById(Long taskId) {
        Task task = findTask(taskId);
        return mapper.toResponse(task);
    }

    @Transactional
    public TaskResponseDto update(Long taskId, UpdateTaskRequestDto request) {
        Task task = findTask(taskId);

        mapper.updateEntity(task, request);
        return mapper.toResponse(task);
    }

    @Transactional
    public TaskResponseDto updateCompletion(Long taskId, UpdateTaskCompletionRequestDto request) {
        Task task = findTask(taskId);
        task.setCompleted(request.completed());
        return mapper.toResponse(task);
    }


    @Transactional
    public TaskResponseDto create(CreateTaskRequestDto request) {

        Task task = mapper.toEntity(request);
        Task savedTask = repository.save(task);

        return mapper.toResponse(savedTask);
    }

    @Transactional
    public void delete(Long taskId) {
        Task task = findTask(taskId);
        repository.delete(task);
    }

    private Task findTask(Long taskId) {

        return repository
                .findById(taskId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Task", "id", taskId)
                );
    }

}