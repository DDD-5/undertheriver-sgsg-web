import React, { useState, useEffect, useRef } from 'react';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import GNB from '@/components/common/GNB';
import Memo from '@/components/memo/Memo';
import Popup from '@/components/popup/Popup';
import NewMemoBtn from '@/assets/img/newMemo.svg';
import FolderList from '@/components/folder/FolderList';
import SearchBar from '@/components/common/SearchBar';
import Api, { checkFolder, userInfo } from '@/api/api';
import ErrorPopup from '@/components/common/ErrorPopup';
import { useModal } from '@/hooks/UseModal';
import Modal from '@/components/common/Modal';
import MemoList from '@/components/memo/MemoList';
import { MemoListProvider } from '@/contexts/MemoListContext';
import { SWRConfig } from 'swr';

const pageWrapper = css`
  background: #f9f7f2;
  height: 100%;

  .content-wrapper {
    display: flex;
    max-width: 1280px;
    min-height: 100vh;
    height: 100%;
    margin: auto;
    justify-content: space-between;
    //padding-top: 5rem;
    padding-bottom: 13.75rem;
  }

  .aside-wrapper {
    min-width: 20%;
    height: 100%;
    margin-top: 9.5rem;
    flex-shrink: 0;
  }

  .right-section {
    flex-grow: 1;
    margin-top: 3.5rem;
    margin-left: 5%;

    .header {
      display: flex;
      justify-content: space-between;

      .folder-name {
        display: inline;
        color: #3c3a37;
        font-size: 2.5rem;
        line-height: 3.625rem;
        font-weight: bold;
      }

      .folder-count {
        display: inline;
        font-size: 2.5rem;
        line-height: 3.625rem;
        color: #3c3a37;
        margin-left: 1rem;
      }
    }
  }
`;

const cardListWrapper = css`
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(302px, 302px));
    gap: 1.5rem;
    margin-top: 3rem;
  }
`;

const defaultMsg = '일시적인 오류입니다. 잠시 후 다시 시도해주세요.';

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    hasFolderPassword: false,
    name: '',
    profileImageUrl: '',
  });
  const [writePopup, setWritePopup] = useState({
    flag: false,
    left: 0,
    top: 0,
  });
  const [errorPopup, setErrorPopup] = useState({
    active: '',
    content: '',
  });
  const [folderList, setFolderList] = useState([]);
  const [allMemoLength, setAllMemoLength] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState({ title: '전체', id: null, length: 0 });
  const [sortType, setSortType] = useState(
    localStorage.getItem('sort_type') ? localStorage.getItem('sort_type') : 'CREATED_AT',
  );
  const [updateFlag, setUpdateFlag] = useState(false);
  const { handleOpenModal } = useModal();
  const [cards, setCards] = useState([
    {
      createdAt: '',
      favorite: false,
      folderColor: '',
      folderId: 0,
      folderTitle: '',
      memoContent: '',
      memoId: 0,
      thumbnailUrl: '',
    },
  ]);

  const [isSearchBar] = useState(localStorage.getItem('search_bar'));
  const buttonRef = useRef();

  useEffect(() => {
    userInfoApi();
  }, []);

  useEffect(() => {
    checkFolderApi();
  }, [sortType]);

  useEffect(() => {
    if (updateFlag) {
      checkFolderApi();
      setUpdateFlag(false);
    }
  }, [updateFlag]);

  const memoWrite = () => {
    if (buttonRef.current !== null) {
      setWritePopup({
        flag: true,
        left: buttonRef.current.offsetLeft - 344,
        top: buttonRef.current.offsetTop + 72,
      });
    }
  };

  const userInfoApi = () => {
    try {
      setLoading(true);
      Api.userInfo()
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            const data = response.data;
            if (data.success) {
              setUser({
                ...user,
                email: data.response.email,
                hasFolderPassword: data.response.hasFolderPassword,
                name: data.response.name,
                profileImageUrl: data.response.profileImageUrl,
              });
              localStorage.setItem('user', JSON.stringify(data.response));
            } else {
              setErrorPopup({ active: 'active', content: defaultMsg });
            }
          } else {
            setErrorPopup({ active: 'active', content: defaultMsg });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setErrorPopup({ active: 'active', content: defaultMsg });
        });
    } catch (e) {
      setLoading(false);
      setErrorPopup({ active: 'active', content: defaultMsg });
    }
  };

  const checkFolderApi = () => {
    try {
      setLoading(true);
      Api.checkFolder(sortType)
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            const data = response.data;
            if (data.success) {
              let memoLength = 0;
              for (let i = 0; i < data.response.length; i++) {
                memoLength += data.response[i].memoCount;
              }
              setAllMemoLength(memoLength);
              setFolderList(data.response);
            } else {
              setErrorPopup({ active: 'active', content: defaultMsg });
            }
          } else {
            setErrorPopup({ active: 'active', content: defaultMsg });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setErrorPopup({ active: 'active', content: defaultMsg });
        });
    } catch (e) {
      setLoading(false);
      setErrorPopup({ active: 'active', content: defaultMsg });
    }
  };

  return (
    <>
      <MemoListProvider>
        <GNB />
        <main css={pageWrapper}>
          {isSearchBar === 'true' && <SearchBar />}
          <section
            className="content-wrapper"
            css={{ paddingTop: isSearchBar === 'true' ? '1rem' : '5rem' }}
          >
            <aside className="aside-wrapper">
              <FolderList
                folderList={folderList}
                setSortType={setSortType}
                allMemoLength={allMemoLength}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
              />
            </aside>
            <div className="right-section">
              <div className="header">
                <h2 className="folder-name">
                  {selectedFolder.title}
                  <span className="folder-count">
                    {selectedFolder.length !== 0 ? selectedFolder.length : allMemoLength}
                  </span>
                </h2>
                <button onClick={() => memoWrite()} ref={buttonRef}>
                  <figure>
                    <img src={NewMemoBtn} alt="Button too add new notes" />
                  </figure>
                </button>
              </div>
              <article css={cardListWrapper}>
                <ul className="card-list">
                  <MemoList />
                </ul>
              </article>
            </div>
          </section>
        </main>
        {writePopup.flag && (
          <Popup
            writePopup={writePopup}
            setWritePopup={setWritePopup}
            folderList={folderList}
            setUpdateFlag={setUpdateFlag}
          />
        )}
        <ErrorPopup
          active={errorPopup.active}
          content={errorPopup.content}
          setErrorPopup={setErrorPopup}
        />
      </MemoListProvider>
    </>
  );
};
export default Main;
