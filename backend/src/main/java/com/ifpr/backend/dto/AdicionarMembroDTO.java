package com.ifpr.backend.dto;

import com.ifpr.backend.entity.enums.PapelCarteira;

import lombok.Data;

@Data
public class AdicionarMembroDTO {

    private String email;

    private PapelCarteira papel;
}