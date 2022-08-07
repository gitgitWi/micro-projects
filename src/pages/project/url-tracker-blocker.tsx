import { ChangeEventHandler, useEffect, useRef, useState } from 'react';

import { blockerHostClassifier } from '../../utils/blocker-host-classifier';
import styles from './styles.module.scss';

const DEFAULT_DESCRIPTION = `사용자 추적기가 제거된 URL로 이동해봅시다 🚀`;

const urlValidator = (url: string) => {
  return /^(http)(s)?:\/\/\S+\.\S+/.test(url);
};

const copyToClipboard = async (url: string) => {
  return navigator.clipboard.writeText(url);
};

/** @todo 컴포넌트 분리 */
const UrlTrackerBlocker = () => {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  const [serviceName, setServiceName] = useState<string>('');
  const [description, setDescription] = useState<string>(DEFAULT_DESCRIPTION);

  const resetTargetServiceInfo = () => {
    setUrl('');
    setServiceName('');
    setDescription(DEFAULT_DESCRIPTION);
  };

  const handleInputTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const currentUrl = e.currentTarget.value;

    const _isValidUrl = urlValidator(currentUrl);
    setIsValidUrl(_isValidUrl);

    if (!_isValidUrl) return resetTargetServiceInfo();

    const host = blockerHostClassifier(currentUrl);
    if (!host) return resetTargetServiceInfo();

    const { service, blocker, description } = host;

    const pureUrl = blocker(currentUrl);
    setUrl(pureUrl);
    setServiceName(service);
    setDescription(description);

    // TODO: 리스트 추가
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
        {serviceName.length === 0 ? (
          <h2 className={styles.subtitle}>URL을 입력해주세요 </h2>
        ) : (
          <h2 className={styles.subtitle}>
            <p className={styles.serviceUrl}>{serviceName}</p> {'주소인 것 같네요 🤠'}
          </h2>
        )}

        <input
          type="text"
          ref={urlInputRef}
          onChange={handleInputTextChange}
          className={styles.textInput}
        />

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
          <p className={styles.description}>{description}</p>
        </blockquote>
      </main>
    </>
  );
};

export default UrlTrackerBlocker;
