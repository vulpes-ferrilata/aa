import React, { useMemo } from 'react';

function usePaginator(currentPage: number, totalPage: number) {
    const elidedPageRange = useMemo(() => {
        let minSibling = Math.min(currentPage - 3, totalPage - 6);
        minSibling = Math.max(minSibling, 1);
        let maxSibling = Math.max(currentPage + 3, 6);
        maxSibling = Math.min(maxSibling, totalPage);

        const elidedPageRange: (number|string)[] = Array.from({length: maxSibling - minSibling}, (_, i) => minSibling + i);
        if (elidedPageRange[0] !== 1) {
            elidedPageRange[0] = 1;
        }
        if (elidedPageRange[1] !== 2) {
            elidedPageRange[1] = "...";
        }
        if (elidedPageRange[elidedPageRange.length - 1] !== totalPage) {
            elidedPageRange[elidedPageRange.length - 1] = totalPage; 
        }
        if (elidedPageRange[elidedPageRange.length - 2] !== totalPage - 1) {
            elidedPageRange[elidedPageRange.length - 2] = "..."; 
        }

        return elidedPageRange;
    }, [currentPage, totalPage]);

    return elidedPageRange;
}

export default usePaginator;