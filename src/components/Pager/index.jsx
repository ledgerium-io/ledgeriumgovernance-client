import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function Pager({}) {
  return (
    <Pagination
      aria-label="Page navigation example"
      className="justify-content-center"
    >
      <PaginationItem>
        <PaginationLink previous />
      </PaginationItem>
      <PaginationItem active>
        <PaginationLink>1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink>2</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink>3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink>4</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink>5</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink next />
      </PaginationItem>
    </Pagination>
  );
}
