from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class StadiumSite(Base):
    __tablename__ = "stadium_sites"

    site_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    site_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Macro, Small cell (in-bowl)
    distance_m: Mapped[int] = mapped_column(Integer, nullable=False)
    azimuth_deg: Mapped[int] = mapped_column(Integer, default=0)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    backhaul_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Fibre 10G, Microwave 2G, Fibre 1G
    backhaul_capacity_gbps: Mapped[float] = mapped_column(Float, nullable=False)
    has_5g: Mapped[bool] = mapped_column(Boolean, default=False)
    rf_bands: Mapped[str] = mapped_column(String(100), default="B3 (1800MHz)")
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    measurements: Mapped[List["NetworkMeasurement"]] = relationship(
        "NetworkMeasurement", back_populates="site", cascade="all, delete-orphan"
    )
    assets: Mapped[List["InfrastructureAsset"]] = relationship(
        "InfrastructureAsset", back_populates="site"
    )

class NetworkMeasurement(Base):
    __tablename__ = "network_measurements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    site_id: Mapped[str] = mapped_column(String(10), ForeignKey("stadium_sites.site_id"), nullable=False)
    match_phase: Mapped[str] = mapped_column(String(50), nullable=False)
    time_of_day: Mapped[str] = mapped_column(String(10), nullable=False)
    normal_4g_load_pct: Mapped[float] = mapped_column(Float, nullable=False)
    match_4g_load_pct: Mapped[float] = mapped_column(Float, nullable=False)
    normal_4g_speed_mbps: Mapped[float] = mapped_column(Float, nullable=False)
    match_4g_speed_mbps: Mapped[float] = mapped_column(Float, nullable=False)
    normal_5g_speed_mbps: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    match_5g_speed_mbps: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    match_5g_connection_success_pct: Mapped[float] = mapped_column(Float, default=99.2)

    site: Mapped["StadiumSite"] = relationship("StadiumSite", back_populates="measurements")

class InfrastructureAsset(Base):
    __tablename__ = "infrastructure_assets"

    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    site_id: Mapped[Optional[str]] = mapped_column(String(10), ForeignKey("stadium_sites.site_id"), nullable=True)
    asset_type: Mapped[str] = mapped_column(String(50), nullable=False)  # COW, SMALL_CELL, FIBRE_UPGRADE
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    capacity_added_gbps: Mapped[float] = mapped_column(Float, default=0.0)
    cost_inr: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(30), default="PROPOSED")  # EXISTING, PROPOSED, DEPLOYED
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    site: Mapped[Optional["StadiumSite"]] = relationship("StadiumSite", back_populates="assets")
