export const eraseMediumSourceQuery = (url: string) => {
  const { protocol, host, pathname } = new URL(url);
  return new URL(`${protocol}${host}${pathname}`).toString();
};

export const mediumTrackerDescription = `Medium Daily Digest에 링크된 QueryString 중 source를 제거합니다`;
