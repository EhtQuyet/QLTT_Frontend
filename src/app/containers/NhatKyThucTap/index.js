import React, { useEffect, useState } from 'react';
import NhatKyThucTapManagerment from '@containers/NhatKyThucTap/nhatKyThucTapManagerment';
import DotThucTap from '@containers/DTTComponents/DotThucTap'
import { ROLE } from '@src/constants/contans';
import * as user from '@app/store/ducks/user.duck';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as diadiem from '@app/store/ducks/diadiem.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';
import * as sinhvien from '@app/store/ducks/sinhvien.duck';
import { connect } from 'react-redux';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import Loading from '@components/Loading';

function Index({isLoading, myInfo, ...props}) {
  const [infoGiangVien, setInfoGiangVien] = useState(undefined)

  useEffect(() => {
    getInfoGiangVien();
  }, []);
  async function getInfoGiangVien() {
    if(isGiangVien) {
      const api = await getAllGiaoVien(1,0,{ma_giao_vien: myInfo.username});
      if(api)
      setInfoGiangVien(api.docs[0])
    }
  }




  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);


  return (
    <>
      <Loading active={isLoading}>
      {isSinhVien && <NhatKyThucTapManagerment/>}
      {isGiangVien &&  infoGiangVien && <DotThucTap maGiangVien={infoGiangVien._id}/>}
      </Loading>
      </>
  )
}
function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return {myInfo, isLoading};
}
const actions = {
  ...user.actions,
  ...giaovien.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...sinhvien.actions,
};


export default (connect(mapStateToProps, actions)(Index));
