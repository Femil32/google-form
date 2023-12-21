import ReactPaginate from "react-paginate";

import "./Pagination.scss";

const Pagination = ({
  pageMeta: { total, totalPages, page },
  onPageChange,
}) => {
  return (
    <div className="pagination">
      <ReactPaginate
        previousLabel={"Previous"}
        previousClassName={"previous-page"}
        previousLinkClassName={"previous-link"}
        nextLabel={"Next"}
        nextClassName={"previous-page"}
        nextLinkClassName={"previous-link"}
        forcePage={page - 1}
        breakLabel="..."
        breakClassName={"break"}
        breakLinkClassName={"break-link"}
        pageCount={totalPages}
        marginPagesDisplayed={3}
        disabledClassName={"disable"}
        onPageChange={({ selected }) => onPageChange(selected)}
        containerClassName={"pagination"}
        pageClassName={"inactive-page"}
        pageLinkClassName={"inactive-link"}
        activeLinkClassName={"active-link"}
        activeClassName={"active-page"}
      />
    </div>
  );
};

export default Pagination;
