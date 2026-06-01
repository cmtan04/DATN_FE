import {
  App as AntdApp,
  Avatar,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { useAuth } from "@app/providers/useAuth";
import { useUpdateCurrentUser } from "../../hooks/useUpdateCurrentUser";
import type { UploadFile, UploadProps } from "antd";
import "./style.scss";

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const getUploadErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    return responseData?.message ?? "Khong the cap nhat anh. Vui long thu lai.";
  }

  return "Khong the cap nhat anh. Vui long thu lai.";
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const ProfilePage = () => {
  const { message } = AntdApp.useApp();
  const { user, setUser } = useAuth();
  const updateCurrentUser = useUpdateCurrentUser();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const profile = user?.profile;
  const displayName = profile?.fullName ?? user?.fullName ?? "Tai khoan";
  const avatarUrl = profile?.avatarUrl;

  const profileItems = useMemo(
    () => [
      { label: "Email", value: user?.email ?? "Chua co email" },
      {
        label: "So dien thoai",
        value: profile?.phoneNumber ?? user?.phoneNumber ?? "Chua cap nhat",
      },
      { label: "Vai tro", value: user?.userRole ?? "Nguoi dung" },
    ],
    [
      profile?.phoneNumber,
      user?.email,
      user?.phoneNumber,
      user?.userRole,
    ],
  );

  const uploadProps: UploadProps = {
    accept: "image/png,image/jpeg,image/webp",
    beforeUpload: async (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Chi co the tai len file anh.");
        return Upload.LIST_IGNORE;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        message.error(`Anh can nho hon ${MAX_IMAGE_SIZE_MB}MB.`);
        return Upload.LIST_IGNORE;
      }

      try {
        const avatarDataUrl = await readFileAsDataUrl(file);
        const updatedUser = await updateCurrentUser.mutateAsync({
          avatarUrl: avatarDataUrl,
        });
        setUser(updatedUser);
        setFileList([]);
        message.success("Da cap nhat anh dai dien.");
      } catch (error) {
        message.error(getUploadErrorMessage(error));
      }

      return false;
    },
    fileList,
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    onChange: ({ fileList: nextFileList }) => {
      setFileList(nextFileList.slice(-1));
    },
  };

  return (
    <main className="profile-page">
      <div className="profile-page__header">
        <div>
          <Typography.Title level={1}>Ho so ca nhan</Typography.Title>
          <Typography.Paragraph>
            Cap nhat anh dai dien de ho so hien thi ro rang hon.
          </Typography.Paragraph>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="profile-page__summary">
            <Space direction="vertical" size={16} align="center">
              <Avatar
                className="profile-page__avatar"
                src={avatarUrl}
                icon={<UserOutlined />}
              />
              <div className="profile-page__identity">
                <Typography.Title level={2}>{displayName}</Typography.Title>
                <Typography.Text>{user?.email}</Typography.Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            className="profile-page__upload-card"
            title="Tai anh len website"
          >
            <Upload.Dragger
              {...uploadProps}
              className="profile-page__uploader"
              disabled={updateCurrentUser.isPending}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Chon hoac keo anh vao day</p>
              <p className="ant-upload-hint">
                Ho tro PNG, JPG, WEBP. Dung luong toi da {MAX_IMAGE_SIZE_MB}MB.
              </p>
            </Upload.Dragger>
          </Card>

          <Card className="profile-page__info-card" title="Thong tin tai khoan">
            <div className="profile-page__info-list">
              {profileItems.map((item) => (
                <div className="profile-page__info-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </main>
  );
};
