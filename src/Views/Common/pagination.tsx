import { PaginationItem } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import * as React from 'react';

const useStyles = makeStyles(() => ({
  ul: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
    '& .MuiPaginationItem-root': {
      color: '#c3c2d4',
      fontSize: '1.4rem',
    },
    '&.MuiPagination-ul ': {
      flexWrap: 'nowrap',
    },
    '& button.Mui-selected': {
      background: '#282B39',
      fontWeight: '600',
      '&:hover': {
        background: '#282B39',
      },
    },
  },
}));

export default function BasicPagination({
  count,
  onChange,
  page,
  size,
  shouldOnlyRenderActivePageAndArrows = false,
}: {
  page: number;
  count: number;
  size?: 'small' | 'medium' | 'large';
  onChange:
    | ((event: React.ChangeEvent<unknown>, page: number) => void)
    | undefined;
  shouldOnlyRenderActivePageAndArrows?: boolean;
}) {
  const cs = useStyles();

  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        page={page}
        classes={{
          root: cs.ul,
          text: 'text-1',
        }}
        onChange={onChange}
        size={size}
        defaultPage={1}
        renderItem={(item) => {
          if (shouldOnlyRenderActivePageAndArrows) {
            if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis')
              return <></>;
            if (item.type === 'page' && !item.selected) return <></>;
          }
          return <PaginationItem {...item} />;
        }}
      />
    </Stack>
  );
}
