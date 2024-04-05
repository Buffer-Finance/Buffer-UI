import { Link, LinkProps } from 'react-router-dom';
import { RenderGraphTestResults } from './GraphTests/RenderGraphTestResults';
interface UTMLinkProps extends LinkProps {
  src?: string;
}
const UTMLink = (props: UTMLinkProps) => {
  return (
    <Link
      {...props}
      to={`${props.to}/?utm_source=${
        props.src || 'inappredirect'
      }&utm_medium=redirect&utm_campaign=inapp&utm_term=&utm_content=inapp`}
      // reloadDocument
    />
  );
};
export const Test = () => {
  return (
    <UTMLink to="/binary/BTC-USD" src="notif-redirection">
      Redirect
    </UTMLink>
  );
};
