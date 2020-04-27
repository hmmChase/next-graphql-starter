import PropTypes from 'prop-types';
import NextHead from 'next/head';
import { title } from '../constants';

const Layout = (props) => (
  <>
    <NextHead>
      <title>{props.title ? `${title} | ${props.title}` : `${title}`}</title>
    </NextHead>

    <div>{props.header}</div>

    <div>{props.content}</div>

    <div>{props.footer}</div>
  </>
);

Layout.propTypes = {
  title: PropTypes.string,
  header: PropTypes.element,
  content: PropTypes.element,
  footer: PropTypes.element,
};

export default React.memo(Layout);