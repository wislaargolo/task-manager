package com.wisla.task_manager_api.dto;


import com.wisla.task_manager_api.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTaskRequestDto(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100,
                message = "Title must be between 3 and 100 characters"
        )
        String title,

        @Size(max = 200, message = "Description must not exceed 200 characters")
        String description,

        @NotNull(message = "Priority is required")
        TaskPriority priority,

        @Size(max = 100, message = "Assignee must not exceed 100 characters")
        String assignee
) { }