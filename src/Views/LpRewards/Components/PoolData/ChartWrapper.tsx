import InfoIcon from '@SVG/Elements/InfoIcon';
import cx from 'classnames';
import { RiLoader5Fill } from 'react-icons/ri';

export const ChartWrapper: React.FC<{
  loading: boolean;
  data: Array<any>;
  controls?: { convertToPercents: () => any };
  viewState?: { isPercentsView: boolean };
  togglePercentView?: () => any;
  tooltip?: string | undefined;
  children: any;
}> = ({
  loading,
  data,
  controls,
  viewState,
  togglePercentView,
  tooltip,
  children,
}) => {
  return (
    <div>
      <div className="chart-header">
        <div className="chart-header__line">
          {tooltip && data && (
            <InfoIcon tooltip={tooltip} sm className="pointer" />
          )}
        </div>
        {controls && (
          <div className="chart-controls">
            {!!controls.convertToPercents && (
              <div
                className={cx({
                  'chart-control-checkbox': true,
                  active: viewState?.isPercentsView,
                })}
                onClick={togglePercentView}
              >
                %
              </div>
            )}
          </div>
        )}
      </div>
      {loading && <RiLoader5Fill size="3em" className="loader" />}

      {children}
    </div>
  );
};
