import React from 'react';
import styles from './NotFound.module.css';

/**
 * 404 页面组件
 */
const NotFound: React.FC = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>页面不存在</h2>
        <p className={styles.description}>
          抱歉，您访问的页面不存在或已被删除
        </p>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          返回上一页
        </button>
        <button className={styles.homeButton} onClick={() => (window.location.href = '/')}>
          返回首页
        </button>
      </div>
    </div>
  );
};

export default NotFound;
