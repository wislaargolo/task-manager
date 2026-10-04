package com.wisla.task_manager_api.mapper;

import com.wisla.task_manager_api.dto.CreateTaskRequestDto;
import com.wisla.task_manager_api.dto.TaskResponseDto;
import com.wisla.task_manager_api.dto.UpdateTaskRequestDto;
import com.wisla.task_manager_api.model.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(CreateTaskRequestDto request) {

        return new Task(
            request.title().trim(),
            normalize(request.description()),
            request.priority(),
            normalize(request.assignee())
        );

    }


    public TaskResponseDto toResponse(Task task) {

        return new TaskResponseDto(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.isCompleted(),
            task.getPriority(),
            task.getAssignee()
        );

    }

    public void updateEntity(Task task, UpdateTaskRequestDto request) {
        task.setTitle(request.title().trim());
        task.setDescription(normalize(request.description()));
        task.setPriority(request.priority());
        task.setAssignee(normalize(request.assignee()));
        task.setCompleted(request.completed());
    }


    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

}
