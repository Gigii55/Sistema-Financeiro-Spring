package com.ifpr.backend.dto;

import com.ifpr.backend.entity.enums.PapelCarteira;

import lombok.Data;

@Data
public class AlterarPapelMembroDTO {

    private PapelCarteira papel;
}