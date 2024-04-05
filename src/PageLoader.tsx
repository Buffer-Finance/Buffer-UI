import { Sidebar } from '@Views/Common/SidebarAB';
import { Skeleton } from '@mui/material';

const PageLoader: React.FC<any> = ({}) => {
  return (
    <div className="flex w-full h-full sm:flex-col">
      <Sidebar />
      <div className="flex flex-col w-full gap-5 p-4">
        <div className="flex w-full gap-5">
          <Skeleton
            variant="rectangular"
            sx={{
              width: '60px',
              minWidth: '60px',
              height: '60px',
              borderRadius: '100%',
              backgroundColor: '#32373a',
            }}
          />
          <Skeleton
            variant="rectangular"
            sx={{
              width: '90%',
              minWidth: '90%',
              height: '60px',
              borderRadius: '10px',
              backgroundColor: '#32373a',
            }}
          />
        </div>
        <div className="flex gap-5">
          <Skeleton
            variant="rectangular"
            sx={{
              width: '50%',
              minWidth: '50%',
              height: '60vh',
              borderRadius: '10px',
              backgroundColor: '#32373a',
            }}
          />
          <Skeleton
            variant="rectangular"
            sx={{
              width: '50%',
              minWidth: '50%',
              height: '60vh',
              borderRadius: '10px',
              backgroundColor: '#32373a',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { PageLoader };
