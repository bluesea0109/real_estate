import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Table } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ADMIN, REALTOR, DEFAULT_PAGE_SIZE } from 'utils/config';
import { selectUserRole } from 'store/modules/auth';
import {
  LIST_APARTMENT,
  CREATE_APARTMENT,
  UPDATE_APARTMENT,
  DELETE_APARTMENT,
  listApartment,
  createApartment,
  updateApartment,
  deleteApartment,
  selectApartments,
  selectApartmentStatus,
} from 'store/modules/apartment';
import { Drawer, ApartmentForm } from 'components';
import { resolvedAction } from 'utils/actions';

const ApartmentTable = () => {
  const [editingRecord, setEditingRecord] = useState(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const role = useSelector(selectUserRole);
  const apartments = useSelector(selectApartments);
  const status = useSelector(selectApartmentStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listApartment());
  }, [dispatch]);

  useEffect(() => {
    if (
      [
        resolvedAction(CREATE_APARTMENT),
        resolvedAction(UPDATE_APARTMENT),
      ].includes(status)
    ) {
      handleDrawerClose();
    }
  }, [status]);

  function handleSubmit(payload) {
    if (payload.id) {
      dispatch(updateApartment(payload));
    } else {
      dispatch(createApartment(payload));
    }
  }

  function handleDrawerClose() {
    setEditingRecord(null);
    setIsDrawerOpened(false);
  }

  const isLoading = [
    LIST_APARTMENT,
    CREATE_APARTMENT,
    UPDATE_APARTMENT,
    DELETE_APARTMENT,
  ].includes(status);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Link to={`/apartments/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Realtor',
      dataIndex: ['realtor', 'name'],
      key: 'realtor',
    },
  ];

  if (role === ADMIN || role === REALTOR) {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <React.Fragment>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 5 }}
            shape='circle'
            size='small'
            onClick={() => {
              setEditingRecord(record);
              setIsDrawerOpened(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            shape='circle'
            size='small'
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Do you want to delete this aprtment?',
                icon: <ExclamationCircleOutlined />,
                maskClosable: true,
                onOk: () => {
                  dispatch(deleteApartment(record.id));
                },
              });
            }}
          />
        </React.Fragment>
      ),
    });
  }

  return (
    <React.Fragment>
      {(role === REALTOR || role === ADMIN) && (
        <div className='page-add-record'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerOpened(true)}
          >
            Add Apartment
          </Button>
        </div>
      )}
      <Table
        dataSource={apartments.results}
        columns={columns}
        rowKey='id'
        size='small'
        loading={isLoading}
        bordered
        pagination={{
          defaultPageSize: DEFAULT_PAGE_SIZE,
          total: apartments.totalCount,
          current: apartments.currentPage,
          size: 'default',
        }}
        onChange={(pagination) =>
          dispatch(listApartment({ page: pagination.current }))
        }
      />
      <Drawer
        title='Aparment'
        visible={isDrawerOpened}
        onClose={handleDrawerClose}
      >
        <ApartmentForm
          initialValues={editingRecord}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </React.Fragment>
  );
};

export default ApartmentTable;
