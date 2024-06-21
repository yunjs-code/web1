from flask import Flask, request, render_template_string
import pandas as pd

app = Flask(__name__)

# 병합된 셀을 개별 셀로 풀어서 동일한 값을 채우는 함수 정의
def fill_merged_cells(df):
    for col in df.columns:
        df[col] = df[col].fillna(method='ffill')
    return df

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # 파일 업로드 처리
        file = request.files['file']
        if file:
            # 엑셀 파일 읽기
            excel_file = pd.ExcelFile(file)

            # '업무현황(통합)' 시트 데이터 처리
            df_task = pd.read_excel(excel_file, sheet_name='업무현황(통합)', skiprows=3, usecols="D:E")
            df_task.columns = ['소요시간', '담당자']
            df_task['소요시간'] = pd.to_numeric(df_task['소요시간'], errors='coerce').fillna(0)
            total_time_by_person = df_task.groupby('담당자')['소요시간'].sum()

            # '업무분담현황' 시트 데이터 처리
            df_work_division = pd.read_excel(excel_file, sheet_name='업무분담현황', skiprows=6, usecols="B:F")
            df_work_division = fill_merged_cells(df_work_division)
            df_work_division.columns = ['업무 구분', '고객사', '지역', '사업명', '인수인계']
            new_entries = df_work_division[df_work_division['업무 구분'].str.contains('신규', na=False)]

            # 결과 HTML 생성
            total_time_html = total_time_by_person.to_frame().to_html()
            if not new_entries.empty:
                new_entries_html = new_entries.to_html(index=False)
            else:
                new_entries_html = "<p>No New Entries Found</p>"

            return render_template_string('''
                <!doctype html>
                <title>Excel Data Processing</title>
                <h1>Total Time by Person</h1>
                {{ total_time_html | safe }}
                <h1>New Entries</h1>
                {{ new_entries_html | safe }}
                <br>
                <a href="/">Upload another file</a>
            ''', total_time_html=total_time_html, new_entries_html=new_entries_html)

    return '''
    <!doctype html>
    <title>Upload Excel File</title>
    <h1>Upload Excel File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.run(debug=True)
