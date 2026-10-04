package com.wisla.task_manager_api.dto;

import com.wisla.task_manager_api.enums.TaskPriority;

public record TaskResponseDto(
        Long id,
        String title,
        String description,
        boolean completed,
        TaskPriority priority,
        String assignee
) {
}