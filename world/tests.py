from django.test import TestCase
from world.models import WorldBorder, UserMap, CountryList
from django.core.urlresolvers import reverse
from world.forms import CountryForm, UserMapForm, MapFormSet, CountryEditForm
from selenium import webdriver
from django.test import LiveServerTestCase
from django.contrib.auth.models import User
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import Select


class WorldBorderTests(TestCase):

    def create_border(self, name="testBorder", area=1, pop2005="1",fips="a",iso2="a",iso3="a",un="1",region="1",subregion="1",lon="1",lat="1", objects="2"):
        return WorldBorder.objects.create(name=name,area=area,pop2005=pop2005,fips=fips,iso2=iso2,iso3=iso3,un=un,region=region,subregion=subregion,lon=lon,lat=lat)

    def test_border_creation(self):
        test = self.create_border()
        self.assertTrue(isinstance(test, WorldBorder))
        self.assertEqual(test.__str__(), test.name)

    def test_index_view(self):
        test = self.create_border()
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

class UserMapsTests(TestCase):

    def create_map(self, mapname="testMap"):
        return UserMap.objects.create(mapname=mapname)

    def test_map_creation(self):
        test= self.create_map()
        self.assertTrue(isinstance(test, UserMap))
        self.assertEqual(test.__str__(), test.mapname)

    def test_show_maps_view(self):
        test = self.create_map()
        response = self.client.get(reverse('show_maps'))
        self.assertEqual(response.status_code, 200)

    def test_add_map_form(self):
        test = UserMap.objects.create(mapname="maptest")
        data={'mapname' : test.mapname}
        testform = UserMapForm(data=data)
        self.assertTrue(testform.is_valid())

        testform = UserMapForm()
        self.assertEqual(testform.is_valid(), False)


class CountryListTests(TestCase):

    def create_countrylist(self, layername="testlayer", year=1, layercolour="Blue"):
        return CountryList.objects.create(layername=layername,year=year,layercolour=layercolour)

    def test_countrylist_creation(self):
        test = self.create_countrylist()
        self.assertTrue(isinstance(test, CountryList))
        self.assertEqual(test.__str__(), test.layername)

    def test_add_layer_form(self):
        test = CountryList.objects.create(layername="testlayer", year=1)
        data= {'name' : test.layername,'listofcountries' : 'France', 'year' : test.year, 'layercolour' : 'Green'}
        testform = CountryForm(data=data)
        self.assertTrue(testform.is_valid())

        testform = CountryForm()
        self.assertEqual(testform.is_valid(), False)

    def test_show_layers_view(self):
        test = self.create_countrylist()
        response = self.client.get(reverse('show_layers'))
        self.assertEqual(response.status_code, 200)


class NavTestCase(LiveServerTestCase):

    def setUp(self):
        self.selenium = webdriver.Firefox()
        super(NavTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(NavTestCase, self).tearDown()

    def test_select_populate(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/')
        time.sleep(20)
        select = Select(selenium.find_element_by_id('map'))
        select.select_by_value("testMap")

    def test_second_select(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/')
        time.sleep(2)
        select = Select(selenium.find_element_by_id('map'))
        select.select_by_value("testMap")
        time.sleep(2)
        select = Select(selenium.find_element_by_id('layer'))

    def test_layer_nav(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/show_layers/')
        link = selenium.find_element_by_link_text('Edit')
        link.click()
        time.sleep(1)
        selenium.find_element_by_id('id_countrylist')

    def test_map_nav(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/show_maps/')
        link = selenium.find_element_by_link_text('Edit')
        link.click()
        time.sleep(1)
        selenium.find_element_by_id('id_mapname')

    def test_index_nav(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/')
        link = selenium.find_element_by_link_text('Add Map')
        link.click()
        time.sleep(1)

        selenium.find_element_by_id('id_mapname')

    # works as about:blank will not open unless there are features on the map
    def test_adding_kml(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/')
        time.sleep(2)
        selenium.find_element_by_name('addFeatureValue').send_keys("France")
        submit = selenium.find_element_by_id('addindividualfeatures')
        time.sleep(1)
        submit.click()
        time.sleep(3)
        json = selenium.find_element_by_id('exportjson')
        json.click()
        time.sleep(1)
        selenium.get('about:blank')

    # works as the alert only pops up if there are no map layers
    def test_removing(self):
        selenium = self.selenium
        selenium.get('http://localhost:8080/world/')
        time.sleep(2)
        selenium.find_element_by_name('addFeatureValue').send_keys("France")
        submit = selenium.find_element_by_id('addindividualfeatures')
        time.sleep(1)
        submit.click()
        time.sleep(3)
        clear = selenium.find_element_by_id('clearform')
        clear.click()
        time.sleep(1)
        json = selenium.find_element_by_id('exportjson')
        time.sleep(1)
        json.click()
        time.sleep(1)
        alert=selenium.switch_to_alert()
        alert.accept()



class AdminTestCase(LiveServerTestCase):

    def setUp(self):
        User.objects.create_superuser(
            username='admin',
            password='admin',
            email='admin@example.com'
        )

        self.selenium = webdriver.Firefox()
        super(AdminTestCase, self).setUp()

    def tearDown(self):
        self.selenium.quit()
        super(AdminTestCase, self).tearDown()

    def test_register(self):
        selenium = self.selenium
        #Opening the link we want to test
        selenium.get('http://localhost:8080/world/admin/')
        username = selenium.find_element_by_id('id_username')
        password = selenium.find_element_by_id('id_password')
        username.send_keys("admin")
        password.send_keys("testpassword")
        # password.send_keys(Keys.RETURN)
        selenium.find_element_by_xpath('//*[@id="login-form"]/div[3]/input').click()
        password.submit()
        time.sleep(1)
        selenium.get('http://localhost:8080/world/admin/auth/user/add/')

        selenium.find_element_by_id('id_username').send_keys("test")
        selenium.find_element_by_name('password1').send_keys("test")
        selenium.find_element_by_name('password2').send_keys("test")

        selenium.find_element_by_id("user_form").submit()
