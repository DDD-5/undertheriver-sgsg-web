import React, { useEffect, useRef, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react';
import Tag from '@/components/Card/Tag';
import Modal from '@/components/Common/Modal';
import CardMenu from '@/components/Card/CardMenu';
import Badge from '@/components/Card/Badge';
import MoreBtn from '@/assets/img/more.svg';
import { useModal } from '@/hooks/UseModal';
import useMenu from '@/hooks/UseMenu';

const cardWrapper = css`
  padding-top: 100%;
  box-sizing: border-box;
  position: relative;
  background: white;
  box-shadow: 0 8px 8px rgba(222, 218, 209, 0.5);
  border-radius: 2px;

  .content {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 0.375rem;
  }
`;

const innerCardWrapper = css`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(165, 170, 178, 0.3);
  box-sizing: border-box;
  border-radius: 2px;
  padding-top: 100%;
`;
const headerSection = css`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;

  .date {
    font-family: 'Black Han Sans', sans-serif;
    font-size: 0.875rem;
    color: #888888;
    line-height: 17px;
    align-self: center;
  }

  .badge {
    align-self: center;
  }

  .menu-btn {
    align-self: center;
  }
`;

const bodySection = css`
  height: calc(100% - 4.5rem);
  padding-left: 1rem;
`;

const tagSection = css`
  height: 1.5rem;
  margin-top: -1rem;
`;

const menu = [
  { label: '메모 잠그기' },
  { label: '즐겨찾기 해제' },
  { label: '수정하기' },
  { label: '삭제하기' },
];

function Card(props) {
  const { handleOpenModal } = useModal();
  const { onOpenMenu, isMenuOpen, onCloseMenu } = useMenu();
  const wrapperRef = useRef(null);
  onCloseMenu(wrapperRef);

  return (
    <>
      <Modal />
      <Box css={cardWrapper}>
        <div className="content">
          <div css={innerCardWrapper}>
            <div className="content">
              <div css={headerSection}>
                <span className="date">{props.memo.createdAt}</span>
                {props.memo.favorite && <Badge color={props.memo.folderColor} className="badge" />}
                <span className="menu-btn" onClick={onOpenMenu}>
                  <img src={MoreBtn} />
                </span>
              </div>
              {isMenuOpen && (
                <div ref={wrapperRef}>
                  <CardMenu menu={menu} />
                </div>
              )}
              <div css={bodySection} onClick={handleOpenModal}>
                {props.memo.memoContent}
              </div>
              <div css={tagSection}>
                <Tag color={props.memo.folderColor} text={props.memo.folderTitle} />
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

export default Card;
