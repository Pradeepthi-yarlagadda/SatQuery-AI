"""
SatQuery AI - Interactive Vision-Language Assistant for Remote Sensing & Satellite Imagery
SIH Problem Statement SIH26167 (ISRO / Space Applications Centre)
"""

import streamlit as st
import os
import io
import json
from PIL import Image
import numpy as np

from satquery.config import TaskType, SensorType, SUPPORTED_BENCHMARKS
from satquery.core.geo_processor import GeoImage
from satquery.agent.orchestrator import SatQueryAgent
from satquery.models.registry import ModelRegistry
from satquery.data.sample_generator import (
    generate_bitemporal_pair,
    generate_optical_sar_pair,
    generate_single_scene
)

# Set page configuration
st.set_page_config(
    page_title="SatQuery AI | ISRO SIH26167",
    page_icon="🛰️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .badge-optical {
        background-color: #DBEAFE;
        color: #1E40AF;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.85rem;
    }
    .badge-sar {
        background-color: #FEF3C7;
        color: #92400E;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.85rem;
    }
    .metric-card {
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 8px;
    }
    .answer-box {
        background: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%);
        border-left: 5px solid #3B82F6;
        padding: 16px 20px;
        border-radius: 6px;
        margin-top: 15px;
        margin-bottom: 15px;
        font-size: 1.12rem;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_resource
def get_agent():
    return SatQueryAgent()

agent = get_agent()


# --- SIDEBAR: BENCHMARK & DEMO PRESETS ---
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80", use_container_width=True)
    st.title("🛰️ SatQuery AI")
    st.caption("**SIH26167** • ISRO / SAC Evaluation Standard")
    st.markdown("---")

    st.subheader("🎯 Demo Scenarios")
    preset = st.radio(
        "Load Curated Benchmark Pair:",
        [
            "Custom Upload",
            "Bi-temporal Urban Expansion (2020 vs 2026)",
            "Cartosat Optical + RISAT SAR (Cloud Penetration)",
            "High-Res Coastal Infrastructure (Grounding/VQA)"
        ]
    )

    st.markdown("---")
    st.subheader("🏛️ Specialized Model Registry")
    for task_name, info in ModelRegistry.list_available_models().items():
        with st.expander(f"📦 {info['name']}"):
            st.write(f"**Benchmark**: `{info['benchmark']}`")
            st.write(f"**Sensors**: {', '.join(info['sensors'])}")
            st.caption(info["description"])

    st.markdown("---")
    st.caption("Developed for Smart India Hackathon • ISRO Space Applications Centre")


# --- MAIN HEADER ---
st.markdown('<div class="main-header">🛰️ SatQuery AI: Vision-Language Assistant</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Agentic remote-sensing query intelligence with automated model selection, biophysical grounding, and auditable execution telemetry.</div>', unsafe_allow_html=True)

# Session state initialization for images and query
if "img1" not in st.session_state:
    st.session_state.img1 = None
if "img2" not in st.session_state:
    st.session_state.img2 = None
if "default_query" not in st.session_state:
    st.session_state.default_query = "What is visible in this satellite scene?"


# Load presets if selected
if preset == "Bi-temporal Urban Expansion (2020 vs 2026)":
    t1, t2 = generate_bitemporal_pair()
    st.session_state.img1 = t1
    st.session_state.img2 = t2
    st.session_state.default_query = "What changed between these two dates? Has the built-up area increased?"

elif preset == "Cartosat Optical + RISAT SAR (Cloud Penetration)":
    opt, sar = generate_optical_sar_pair()
    st.session_state.img1 = opt
    st.session_state.img2 = sar
    st.session_state.default_query = "Use both optical and SAR images to verify water bodies and structures through cloud cover."

elif preset == "High-Res Coastal Infrastructure (Grounding/VQA)":
    single = generate_single_scene()
    st.session_state.img1 = single
    st.session_state.img2 = None
    st.session_state.default_query = "Highlight the water body and count the circular storage tanks."


# --- IMAGE UPLOAD SECTION ---
st.subheader("1. Satellite Imagery Ingestion")

col_upload1, col_upload2 = st.columns(2)

with col_upload1:
    st.markdown("**Image 1 (Primary / Time 1 / Optical)**")
    file1 = st.file_uploader("Upload Image 1 (GeoTIFF / PNG / JPG)", type=["tif", "tiff", "png", "jpg", "jpeg"], key="up1")
    if file1 is not None:
        st.session_state.img1 = GeoImage.from_source(file1.read(), filename=file1.name)

    if st.session_state.img1 is not None:
        st.image(st.session_state.img1.to_pil(), use_container_width=True)
        s_type = st.session_state.img1.sensor_type.value
        badge_class = "badge-sar" if "SAR" in s_type else "badge-optical"
        st.markdown(f'<span class="{badge_class}">{s_type}</span> ({st.session_state.img1.width}×{st.session_state.img1.height})', unsafe_allow_html=True)
    else:
        st.info("Upload Image 1 or pick a preset from the sidebar.")

with col_upload2:
    st.markdown("**Image 2 (Time 2 / SAR / Cross-Modal — Optional)**")
    file2 = st.file_uploader("Upload Image 2 (Bi-temporal or SAR)", type=["tif", "tiff", "png", "jpg", "jpeg"], key="up2")
    if file2 is not None:
        st.session_state.img2 = GeoImage.from_source(file2.read(), filename=file2.name)

    if st.session_state.img2 is not None:
        st.image(st.session_state.img2.to_pil(), use_container_width=True)
        s_type = st.session_state.img2.sensor_type.value
        badge_class = "badge-sar" if "SAR" in s_type else "badge-optical"
        st.markdown(f'<span class="{badge_class}">{s_type}</span> ({st.session_state.img2.width}×{st.session_state.img2.height})', unsafe_allow_html=True)
    else:
        st.caption("Optional: Leave empty for single-image VQA, Grounding, or Captioning.")


# --- QUERY INTERACTION SECTION ---
st.markdown("---")
st.subheader("2. Conversational Inquiries & Natural Language Query")

# Suggested quick query buttons
st.markdown("**Suggested Quick Inquiries:**")
s_col1, s_col2, s_col3, s_col4 = st.columns(4)
with s_col1:
    if st.button("🔍 Change: What changed?"):
        st.session_state.default_query = "What changed between these two satellite images?"
with s_col2:
    if st.button("📍 Ground: Highlight water"):
        st.session_state.default_query = "Highlight the water body on the image."
with s_col3:
    if st.button("📡 Fusion: Cross-modal SAR"):
        st.session_state.default_query = "Use both optical and SAR to identify structures and water through cloud cover."
with s_col4:
    if st.button("📝 Caption: Describe scene"):
        st.session_state.default_query = "Describe this satellite image and classify its land cover."

user_query = st.text_input(
    "Enter your remote-sensing question:",
    value=st.session_state.default_query,
    placeholder="e.g. Has the built-up area expanded? or How many water bodies are visible?"
)

col_btn1, col_btn2 = st.columns([1, 4])
with col_btn1:
    analyze_clicked = st.button("🚀 Analyze with SatQuery Agent", type="primary", use_container_width=True)


# --- PROCESSING & RESULTS DISPLAY ---
if analyze_clicked:
    if st.session_state.img1 is None:
        st.error("Please upload or select at least one satellite image.")
    else:
        # Prepare image list
        input_images = [st.session_state.img1]
        if st.session_state.img2 is not None:
            input_images.append(st.session_state.img2)

        with st.spinner("SatQuery Agent analyzing query, validating geometry, and executing specialist model..."):
            result = agent.process(input_images, user_query)

        st.markdown("---")
        st.subheader("3. Remote-Sensing Analysis & Visual Evidence")

        if not result["success"]:
            st.error(f"Validation Error: {result['answer']}")
        else:
            # Answer Box
            trace_sum = result["trace"].summary
            conf_pct = int(result["confidence"] * 100)
            st.markdown(f"""
            <div class="answer-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 700; color: #1E3A8A; font-size: 1.15rem;">💬 Agent Assessment</span>
                    <span style="background-color: #10B981; color: white; padding: 3px 10px; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">
                        {conf_pct}% Confidence • {trace_sum['benchmark_alignment'].split('/')[0].strip()}
                    </span>
                </div>
                <div>{result['answer']}</div>
            </div>
            """, unsafe_allow_html=True)

            # Visual Evidence & Metrics Columns
            col_vis, col_meta = st.columns([3, 2])

            with col_vis:
                st.markdown("**Visual Evidence Output**")
                if result["visual_result"] is not None:
                    vis_img = Image.fromarray(result["visual_result"])
                    st.image(vis_img, caption=f"Specialist Output: {result['task_type'].value}", use_container_width=True)
                else:
                    st.image(st.session_state.img1.to_pil(), caption="Primary Scene", use_container_width=True)

            with col_meta:
                st.markdown("**Biophysical Metrics & Telemetry**")
                for k, v in result["metrics"].items():
                    if isinstance(v, dict):
                        st.markdown(f"**{k.replace('_', ' ').title()}:**")
                        for sub_k, sub_v in v.items():
                            st.write(f"- *{sub_k}*: `{sub_v}`")
                    else:
                        st.metric(label=k.replace("_", " ").title(), value=v)

            # Auditable Execution Trace (ISRO Mandatory Section)
            st.markdown("---")
            st.subheader("4. 🛰️ ISRO/SAC Auditable Execution Trace")
            st.caption("Complete transparent telemetry detailing input validation, dynamic tool selection, and model parameters.")

            trace_tab1, trace_tab2 = st.tabs(["Formatted Execution Report", "Raw JSON Telemetry"])

            with trace_tab1:
                st.markdown(result["trace"].to_markdown())

            with trace_tab2:
                trace_json = json.dumps(result["trace"].to_dict(), indent=2)
                st.code(trace_json, language="json")
                st.download_button(
                    label="📥 Download Auditable Trace (JSON)",
                    data=trace_json,
                    file_name="satquery_execution_trace.json",
                    mime="application/json"
                )
