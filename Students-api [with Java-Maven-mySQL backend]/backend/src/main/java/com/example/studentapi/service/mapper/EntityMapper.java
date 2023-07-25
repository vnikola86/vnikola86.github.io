package com.example.studentapi.service.mapper;

import java.util.List;

public interface EntityMapper<E, D> {
    D toDTO(E e);

    E toEntity(D d);

    default List<D> toDTOList(List<E> eList) {
        return eList.stream().map(this::toDTO).toList();
    }

    default List<E> toEntityList(List<D> dList) {
        return dList.stream().map(this::toEntity).toList();
    }

}
