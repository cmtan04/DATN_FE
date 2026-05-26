import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  Form,
  Grid,
  Select,
  Slider,
  Space,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLocationType } from "../../api/location.api";
import { LocationEndpoint } from "../../api/location.endpoints";
import type { ProfileLocationFilter } from "../../types";
import "./style.scss";

interface LocationFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  initialFilter: ProfileLocationFilter;
  onApply: (filter: ProfileLocationFilter) => void;
}

const SORT_OPTIONS = [
  { label: "Moi nhat", value: "createdAt-DESC" },
  { label: "Gia: Thap den Cao", value: "locationPrice-ASC" },
  { label: "Gia: Cao den Thap", value: "locationPrice-DESC" },
  { label: "Dien tich: Nho den Lon", value: "locationArea-ASC" },
  { label: "Dien tich: Lon den Nho", value: "locationArea-DESC" },
  { label: "Danh gia cao nhat", value: "locationRate-DESC" },
];

const { useBreakpoint } = Grid;

export const LocationFilterDrawer = ({
  open,
  onClose,
  initialFilter,
  onApply,
}: LocationFilterDrawerProps) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const { data: locationTypes } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: getAllLocationType,
  });

  useEffect(() => {
    const sortValue = initialFilter.sortBy
      ? `${initialFilter.sortBy}-${initialFilter.sortOrder || "DESC"}`
      : undefined;

    form.setFieldsValue({
      locationType: initialFilter.locationType
        ? initialFilter.locationType.split(",")
        : [],
      priceRange: [
        initialFilter.minPrice ?? 0,
        initialFilter.maxPrice ?? 20000000,
      ],
      areaRange: [initialFilter.minArea ?? 0, initialFilter.maxArea ?? 200],
      sort: sortValue,
    });
  }, [form, initialFilter]);

  const getFilterFromForm = (): ProfileLocationFilter => {
    const values = form.getFieldsValue();
    const typeArr: string[] = values.locationType ?? [];
    let sortBy: string | undefined;
    let sortOrder: "ASC" | "DESC" | undefined;

    if (values.sort) {
      const [field, order] = String(values.sort).split("-");
      sortBy = field;
      sortOrder = order as "ASC" | "DESC";
    }

    return {
      locationType: typeArr.length > 0 ? typeArr.join(",") : undefined,
      minPrice: values.priceRange?.[0] > 0 ? values.priceRange[0] : undefined,
      maxPrice:
        values.priceRange?.[1] < 20000000 ? values.priceRange[1] : undefined,
      minArea: values.areaRange?.[0] > 0 ? values.areaRange[0] : undefined,
      maxArea: values.areaRange?.[1] < 200 ? values.areaRange[1] : undefined,
      sortBy,
      sortOrder,
    };
  };

  const handleValuesChange = () => {
    if (!isDesktop) return;
    onApply(getFilterFromForm());
  };

  const handleApply = () => {
    onApply(getFilterFromForm());
    onClose();
  };

  const handleReset = () => {
    form.resetFields();
    if (isDesktop) {
      onApply(getFilterFromForm());
    }
  };

  const priceRange = Form.useWatch("priceRange", form) ?? [0, 20000000];
  const areaRange = Form.useWatch("areaRange", form) ?? [0, 200];

  const formContent = (
    <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
      <div className="location-filter__section">
        <Typography.Title level={5}>Sap xep theo</Typography.Title>
        <Form.Item name="sort" noStyle>
          <Select
            allowClear
            placeholder="Chon kieu sap xep"
            options={SORT_OPTIONS}
          />
        </Form.Item>
      </div>

      <Divider />

      <Form.Item label="Loai hinh cho o" name="locationType">
        <Checkbox.Group className="location-filter__checkboxes">
          {locationTypes?.map((type) => (
            <Checkbox key={type.typeCode} value={type.typeCode}>
              {type.typeName}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>

      <Divider />

      <Form.Item label="Khoang gia (VND)" name="priceRange">
        <Slider
          range
          min={0}
          max={20000000}
          step={500000}
          marks={{ 0: "0", 20000000: "20tr+" }}
          tooltip={{ formatter: (value) => `${value?.toLocaleString()}d` }}
        />
      </Form.Item>
      <div className="location-filter__range-label">
        {priceRange[0].toLocaleString()}d -{" "}
        {priceRange[1] >= 20000000
          ? "Tren 20.000.000d"
          : `${priceRange[1].toLocaleString()}d`}
      </div>

      <Divider />

      <Form.Item label="Dien tich su dung (m2)" name="areaRange">
        <Slider
          range
          min={0}
          max={200}
          step={5}
          marks={{ 0: "0", 200: "200+" }}
          tooltip={{ formatter: (value) => `${value} m2` }}
        />
      </Form.Item>
      <div className="location-filter__range-label">
        {areaRange[0]} m2 -{" "}
        {areaRange[1] >= 200 ? "Tren 200 m2" : `${areaRange[1]} m2`}
      </div>
    </Form>
  );

  if (isDesktop) {
    return (
      <aside className="location-filter">
        <div className="location-filter__head">
          <h3>Bo loc tim kiem</h3>
          <Button type="link" onClick={handleReset}>
            Dat lai
          </Button>
        </div>
        {formContent}
      </aside>
    );
  }

  return (
    <Drawer
      title="Bo loc & Sap xep"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      extra={
        <Space>
          <Button onClick={handleReset}>Xoa bo loc</Button>
          <Button type="primary" onClick={handleApply}>
            Ap dung
          </Button>
        </Space>
      }
    >
      {formContent}
    </Drawer>
  );
};
