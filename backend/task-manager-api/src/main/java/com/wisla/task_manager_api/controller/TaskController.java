package com.wisla.task_manager_api.controller;

import com.wisla.task_manager_api.dto.CreateTaskRequestDto;
import com.wisla.task_manager_api.dto.TaskResponseDto;
import com.wisla.task_manager_api.dto.UpdateTaskCompletionRequestDto;
import com.wisla.task_manager_api.dto.UpdateTaskRequestDto;
import com.wisla.task_manager_api.service.TaskService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @GetMapping
    public List<TaskResponseDto> findAll() {
        return taskService.findAll();
    }


    @GetMapping("/{taskId}")
    public TaskResponseDto findById(@PathVariable Long taskId) {
        return taskService.findById(taskId);
    }

    @PutMapping("/{taskId}")
    public TaskResponseDto update(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequestDto request
    ) {
        return taskService.update(taskId, request);
    }

    @PatchMapping("/{taskId}")
    public TaskResponseDto updateCompletion(
            @PathVariable Long taskId,
            @RequestBody UpdateTaskCompletionRequestDto request
    ) {
        return taskService.updateCompletion(taskId, request);
    }


    @PostMapping
    public ResponseEntity<TaskResponseDto> create(@Valid @RequestBody CreateTaskRequestDto request) {

        TaskResponseDto createdTask = taskService.create(request);

        URI location = ServletUriComponentsBuilder
                        .fromCurrentRequest()
                        .path("/{taskId}")
                        .buildAndExpand(createdTask.id())
                        .toUri();

        return ResponseEntity.created(location).body(createdTask);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long taskId) {
        taskService.delete(taskId);
    }

}