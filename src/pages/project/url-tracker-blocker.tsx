import { ChangeEventHandler, useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';

const urlValidator = (url: string) => {
  return /^(http)(s)?:\/\/\S+\.\S+/.test(url);
};

const eraseMediumSourceQuery = (url: string) => {
  const { protocol, host, pathname } = new URL(url);
  return new URL(`${protocol}${host}${pathname}`).toString();
};

const copyToClipboard = async (url: string) => {
  return navigator.clipboard.writeText(url);
};

/** @todo 컴포넌트 분리 */
const UrlTrackerBlocker = () => {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  const handleInputTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const currentUrl = e.currentTarget.value;
    const _isValidUrl = urlValidator(currentUrl);
    setIsValidUrl(_isValidUrl);

    if (!_isValidUrl) {
      setUrl('');
      return;
    }
    const pureUrl = eraseMediumSourceQuery(currentUrl);
    setUrl(pureUrl);
    setTimeout(() => {
      // 클립보드 복사
      // TODO: toast UI로 변경
      copyToClipboard(pureUrl).then(() => alert('클립보드에 주소가 복사되었습니다'));

      // 리스트 추가
    }, 200);
  };

  useEffect(() => {
    urlInputRef.current?.focus();
  }, [urlInputRef]);

  return (
    <>
      {/* TODO: 상세페이지 공통 UI 추가 */}
      <header className={styles.header}>
        <h1 className={styles.title}>Url Tracker Blocker</h1>
      </header>
      <main className={styles.main}>
        {/* TODO: 서비스별 메뉴 추가 */}
        <h2 className={styles.subtitle}>Medium Daily Digest 사용자 추적기 차단하기</h2>
        <input
          type="text"
          ref={urlInputRef}
          onChange={handleInputTextChange}
          className={styles.textInput}
        ></input>
        <div className={styles.textsWrapper}>
          <div className={styles.textChanged}>
            Tracker Blocked URL:
            <br />
            {url && isValidUrl ? (
              <a className={styles.textChanged} href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            ) : (
              <p className={styles.textChanged}>{url}</p>
            )}
          </div>
          {url && !isValidUrl && <p className={styles.invalidUrl}>유효하지 않은 주소입니다</p>}
        </div>
        <blockquote className={styles.descriptionWrapper}>
          <p className={styles.description}>
            Medium Daily Digest에 링크된 QueryString에서 <code>source</code> 제거
          </p>
        </blockquote>
      </main>
    </>
  );
};

export default UrlTrackerBlocker;
