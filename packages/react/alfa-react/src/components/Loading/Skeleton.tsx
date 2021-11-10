import * as React from 'react';
import classNames from 'classnames';
import Title, { SkeletonTitleProps } from './Title';
import Paragraph, { SkeletonParagraphProps } from './Paragraph';
import style from './style';

export interface SkeletonProps {
  active?: boolean;
  loading?: boolean;
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
  title?: SkeletonTitleProps | boolean;
  paragraph?: SkeletonParagraphProps | boolean;
}

function getComponentProps<T>(prop: T | boolean | undefined): T | {} {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}

function getTitleBasicProps(hasParagraph: boolean): SkeletonTitleProps {
  if (hasParagraph) {
    return { width: '38%' };
  }
  return {};
}

function getParagraphBasicProps(hasTitle: boolean): SkeletonParagraphProps {
  const basicProps: SkeletonParagraphProps = {};

  // Width
  if (!hasTitle) {
    basicProps.width = '61%';
  }

  // Rows
  if (hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }

  return basicProps;
}

class Skeleton extends React.Component<SkeletonProps, any> {
  static defaultProps: Partial<SkeletonProps> = {
    title: true,
    paragraph: true,
  };

  componentDidMount() {
    const id = '-os-skeleton-style';
    if (document.getElementById('-os-skeleton-style')) {
      return;
    }
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = style;
    styleSheet.id = id;
    document.head.appendChild(styleSheet);
  }

  renderSkeleton = () => {
    const {
      prefixCls = '-os-skeleton',
      loading,
      className,
      children,
      title,
      paragraph,
      active,
    } = this.props;

    if (loading || !('loading' in this.props)) {
      const hasTitle = !!title;
      const hasParagraph = !!paragraph;

      let contentNode;
      if (hasTitle || hasParagraph) {
        // Title
        let $title;
        if (hasTitle) {
          const titleProps: SkeletonTitleProps = {
            prefixCls: `${prefixCls}-title`,
            ...getTitleBasicProps(hasParagraph),
            ...getComponentProps(title),
          };

          $title = <Title {...titleProps} />;
        }

        // Paragraph
        let paragraphNode;
        if (hasParagraph) {
          const paragraphProps: SkeletonParagraphProps = {
            prefixCls: `${prefixCls}-paragraph`,
            ...getParagraphBasicProps(hasTitle),
            ...getComponentProps(paragraph),
          };

          paragraphNode = <Paragraph {...paragraphProps} />;
        }

        contentNode = (
          <div className={`${prefixCls}-content`}>
            {$title}
            {paragraphNode}
          </div>
        );
      }

      const cls = classNames(prefixCls, className, {
        [`${prefixCls}-active`]: active,
      });

      return (
        <div className={cls}>
          {contentNode}
        </div>
      );
    }

    return children;
  };

  render() {
    return this.renderSkeleton();
  }
}

export default Skeleton;
