# 특화 PJT_backend

## 백엔드 실행

1. 가상환경 설정 및 실행

   ```bash
   # 가상환경 생성 (최초)
   python -m venv venv

   # 가상환경 실행 (프로젝트 실행마다)
   source venv/scripts/activate
   ```

2. 패키지 설치하기

   ```bash
   # 패키지 설치
   pip install -r requirements.txt

   # 패키지 저장 (패키지 변경시 실행)
   pip freeze > requirements.txt
   ```

3. mysql 설치 및 설정

   > mysql Ver 8.0.27
   >
   > PORT가 `3306`이 아닐 경우, `backend/settings.py` DATABASES PORT 변경 필요 (업로드 시 주의!)

   ```bash
   # mysql version 확인 (cmd or mysql cmd)
   mysql --version

   # cmd에서 mysql 사용
   mysql -u root -p

   # db 생성 (mysql cmd)
   CREATE DATABASE greenmate DEFAULT CHARACTER SET utf8;

   # [참고] default_character_set_name 설정 확인 (mysql cmd)
   SELECT schema_name, default_character_set_name FROM information_schema.schemata;

   # [참고] default_character_set_name이 utf8이 아닐 경우 변경하기 (mysql cmd)
   ALTER DATABASE greenmate DEFAULT CHARACTER SET utf8;

   # User 생성 (mysql cmd)
   CREATE USER greenmate@localhost IDENTIFIED BY 'greenmateB105';

   # DB 접근권한 부여 (mysql cmd)
   GRANT ALL PRIVILEGES ON greenmate.* TO greenmate@localhost WITH GRANT OPTION;
   FLUSH PRIVILEGES;

   # PORT 확인 (mysql cmd)
   SHOW GLOBAL VARIABLES LIKE 'PORT';
   ```

4. Migration

   > 모델 클래스의 수정 (및 생성 )을 DB에 적용하는 과정

   ```bash
   # 마이그레이션 생성 (django)
   python manage.py makemigrations

   # DB에 적용 (django)
   python manage.py migrate
   ```

5. 실행

   ```bash
   python manage.py runserver
   ```

6. GUI 설정

   - `workbench`

     ```bash
     1. MySQL Connections 추가
     2. Connection Name 설정 (아무거나 가능)
     3. Port 확인
     4. Username 입력 (greenmate)
     5. Password 입력 (greenmateB105)
     ```

     ![image-20220426014408472](C:\Users\multicampus\Desktop\SSAFY\4.자율PJT\GreenMate\backend\README.assets\image-20220426014408472.png)

   - `HeidSQL`

     ```bash
     1. 신규 생성
     2. 사용자, 암호 입력
     3. 포트 확인
     ```

     ![image-20220426014602877](C:\Users\multicampus\Desktop\SSAFY\4.자율PJT\GreenMate\backend\README.assets\image-20220426014602877.png)
