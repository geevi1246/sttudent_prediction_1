import streamlit as st
import pandas as pd
import joblib
from datetime import datetime, timedelta

# ----------- PAGE CONFIG -----------
st.set_page_config(
    page_title="AI Attendance Predictor",
    page_icon="📚",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# ----------- CUSTOM CSS -----------
st.markdown("""
<style>
.main {
    background: #f5f7fa;
}

.title {
    text-align: center;
    font-size: 40px !important;
    font-weight: 900 !important;
    color: #2b5c8a;
}

.card {
    background: white;
    padding: 30px;
    border-radius: 18px;
    box-shadow: 0px 4px 20px rgba(0,0,0,0.08);
}

.input-label {
    font-size: 18px;
    font-weight: 600;
    color: #2b2b2b;
    padding-top: 10px;
}
</style>
""", unsafe_allow_html=True)

# ----------- LOAD MODEL -----------
model = joblib.load("attendance_model.pkl")
le_student = joblib.load("student_encoder.pkl")
le_card = joblib.load("card_encoder.pkl")

# ----------- TITLE -----------
st.markdown("<div class='title'>📘 AI Attendance Prediction</div>", unsafe_allow_html=True)
st.write("### Enter student details to predict tomorrow's attendance likelihood.\n")


# ----------- INPUT CARD -----------
with st.container():
    st.markdown("<div class='card'>", unsafe_allow_html=True)

    student_id = st.text_input("Student ID", placeholder="Enter student ID")
    card_id = st.text_input("Card ID", placeholder="Enter RFID card number")

    if st.button("🔍 Predict Attendance", use_container_width=True):

        # Prevent empty input errors
        if student_id.strip() == "" or card_id.strip() == "":
            st.error("❌ Please enter both Student ID and Card ID")
        else:
            try:
                # Tomorrow's date
                tomorrow = datetime.now() + timedelta(days=1)

                new_data = pd.DataFrame([{
                    "student_id": le_student.transform([student_id])[0],
                    "card_id": le_card.transform([card_id])[0],
                    "day": tomorrow.day,
                    "month": tomorrow.month,
                    "year": tomorrow.year
                }])

                # Predict
                prob = model.predict_proba(new_data)[0][1]
                percentage = prob * 100

                st.success("✅ Prediction Complete!")
                st.subheader(f"📅 Likelihood of coming tomorrow: **{percentage:.2f}%**")

                # Progress bar
                st.progress(float(prob))

            except Exception as e:
                st.error(f"⚠️ Error: {str(e)}")
                st.info("Ensure the Student ID & Card ID exist in the encoders.")

    st.markdown("</div>", unsafe_allow_html=True)
