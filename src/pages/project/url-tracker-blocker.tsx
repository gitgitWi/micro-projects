import {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MdContentCopy, MdOutlineCancel } from 'react-icons/md';
import { FaTelegram } from 'react-icons/fa';
import { default as classnames } from 'classnames';

import { blockerHostClassifier } from '../../utils/blocker-host-classifier';
import { UrlPreviewCard, UrlPreviewCardProps } from '../../components/molecules';
import styles from './styles.module.scss';

// TODO: constants 파일 분리
const DEFAULT_DESCRIPTION = `사용자 추적기가 제거된 URL로 이동해봅시다 🚀`;
const SAMPLE_URL =
  'https://medium.com/@eliran9692/5-software-architectural-patterns-871e2705c998?source=email-';

const urlValidator = (url: string) => {
  return /^(http)(s)?:\/\/[\S^.]+\.[\S^.]+/.test(url);
};

/** @todo 컴포넌트 분리 */
const UrlTrackerBlocker = () => {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const validUrlAnchorRef = useRef<HTMLAnchorElement>(null);

  const [inputText, setInputText] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  const [serviceName, setServiceName] = useState<string>('');
  const [description, setDescription] = useState<string>(DEFAULT_DESCRIPTION);
  const [timeoutId, setTimeoutId] = useState<number>(-1);

  const [urlPreviewProps, setUrlPreviewProps] = useState<UrlPreviewCardProps>({
    title: '',
    url: '',
    author: '',
    description: '',
    image: '',
  });

  const resetTargetServiceInfo = () => {
    setUrl('');
    setServiceName('');
    setDescription(DEFAULT_DESCRIPTION);
  };

  const handleInputTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const currentInputText = e.currentTarget.value.trim();
    setInputText(currentInputText);

    /** @description simple debouncing */
    window.clearTimeout(timeoutId);
    if (timeoutId !== -1) setTimeoutId(-1);

    const _isValidUrl = urlValidator(currentInputText);
    setIsValidUrl(_isValidUrl);

    if (!_isValidUrl) return resetTargetServiceInfo();

    const host = blockerHostClassifier(currentInputText);
    if (!host) return setUrl(currentInputText);

    const { service, blocker, description } = host;
    const targetUrl = blocker(currentInputText);
    setUrl(targetUrl);
    setServiceName(service);
    setDescription(description);

    /**
     * @todo
     * - validation => loading UI
     * - refactoring => hook
     */
    setTimeoutId(
      window.setTimeout(() => {
        fetch(`/api/share/url-preview?url=${targetUrl}`)
          .then((res) => res.json())
          .then(
            ({
              data: { title, author, description, image },
            }: {
              data: {
                title: { type: string; value: string }[];
                author: { type: string; value: string }[];
                description: { type: string; value: string }[];
                image: { type: string; value: string }[];
              };
            }) => {
              setUrlPreviewProps({
                url: targetUrl,
                title:
                  title.find(({ type }) => type === 'og:title' || type === 'twitter:title')
                    ?.value || '',
                author: author.find(({ type }) => type === 'author')?.value || '',
                description:
                  description.find(
                    ({ type }) => type === 'og:description' || type === 'twitter:description'
                  )?.value || '',
                image:
                  image.find(({ type }) => type === 'og:image' || type === 'twitter:image:src')
                    ?.value || '',
              });
            }
          );
      }, 200)
    );
    // TODO: 리스트 추가, 우선 localStorage 활용 -> DB 활용
  };

  const handleInputKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key.toLowerCase() === 'enter' && isValidUrl) {
      validUrlAnchorRef.current?.click();
    }
  };

  const handleResetButtonClick: MouseEventHandler = () => {
    if (inputText.length === 0) return;
    urlInputRef.current!.value = '';
    setInputText('');
    resetTargetServiceInfo();
  };

  const copyToClipboard = async () => {
    if (!isValidUrl) return;
    navigator.clipboard.writeText(url);
    alert(`주소가 클립보드에 복사되었습니다`);
  };

  const handleTelegramShareClick = async () => {
    try {
      const { health: isMessageCreated, reason } = await fetch(
        `/api/share/telegram?${new URLSearchParams({ targetUrl: url }).toString()}`
      ).then((res) => res.json());
      if (!isMessageCreated) throw new Error(`url: ${url}\nreason: ${reason}`);
      // TODO toast 컴포넌트로 성공/실패 알려주기
    } catch (error) {
      console.error(`[ERROR#handleTelegramShareClick]\n${error}`);
    }
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

        <div className={styles.inputWrapper}>
          <input
            type="text"
            ref={urlInputRef}
            onChange={handleInputTextChange}
            onKeyUp={handleInputKeyUp}
            className={styles.textInput}
            placeholder={SAMPLE_URL}
          />

          <button
            type="button"
            onClick={handleResetButtonClick}
            className={classnames(
              styles.resetButton,
              inputText.length === 0 ? styles.resetButtonDisabled : styles.resetButtonEnabled
            )}
          >
            <MdOutlineCancel />
          </button>

          <button
            type="button"
            className={classnames(
              styles.copyButton,
              isValidUrl ? styles.copyButtonEnabled : styles.copyButtonDisabled
            )}
            onClick={copyToClipboard}
          >
            <MdContentCopy />
          </button>
        </div>

        <div className={styles.textsWrapper}>
          <div className={styles.textChanged}>
            Tracker Blocked URL:
            <br />
            {url && isValidUrl ? (
              <a
                className={styles.textChanged}
                href={url}
                target="_blank"
                rel="noreferrer"
                ref={validUrlAnchorRef}
              >
                {url}
              </a>
            ) : (
              <p className={styles.textChanged}>{url}</p>
            )}
          </div>
          {url && !isValidUrl && <p className={styles.invalidUrl}>유효하지 않은 주소입니다</p>}

          {urlPreviewProps.title && <UrlPreviewCard {...urlPreviewProps} />}
        </div>

        {/* 링크 외부 앱으로 공유하기 */}
        {isValidUrl && url && (
          <div className={styles.sharing}>
            <div className={styles.sharingTitle}>Share to</div>
            <FaTelegram className={styles.sharingIcon} onClick={handleTelegramShareClick} />
          </div>
        )}

        <blockquote className={styles.descriptionWrapper}>
          <p className={styles.description}>{description}</p>
        </blockquote>
      </main>
    </>
  );
};

export default UrlTrackerBlocker;
