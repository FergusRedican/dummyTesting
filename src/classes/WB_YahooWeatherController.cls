public with sharing class WB_YahooWeatherController {

    public class WeatherData {
        public String location {get; set;}
        public Integer conditionCode {get; set;}
        public String conditionText {get; set;}
        public Integer temperatureInCelcuis {get; set;}
        public String temprature {get; set;}
        public Decimal WOEID_1 {get; set;}
        public Decimal WOEID_2 {get; set;}
    }

    public String strLocation {get; set;}

    public WeatherData weather {get; set;}

    public WeatherData getCurrentWeather() {
        String location = strLocation;
        System.debug('\n\nCW: ' + weather);
        if (weather == null) {
              weather = new WeatherData();
            System.debug('\n\nLocation: ' + location);
            if (location != null) {
                Http h = new Http();
                HttpRequest req = new HttpRequest();

                String url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + location + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

                req.setEndpoint(url);
                req.setMethod('GET');
                try {
                    HttpResponse res = h.send(req);

                    String jsonInput = res.getBody();
                    Map<String, Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(jsonInput);
                    Map<String, Object> query = (Map<String, Object>)jsonMap.get('query');
                    Map<String, Object> results = (Map<String, Object>)query.get('results');
                    Map<String, Object> channel = (Map<String, Object>)results.get('channel');
                    Map<String, Object> item = (Map<String, Object>)channel.get('item');
                    Map<String, Object> condition = (Map<String, Object>)item.get('condition');

                    weather.temprature = (String)condition.get('temp');
                    weather.conditionText = (String)condition.get('text');
                    weather.conditionCode = Integer.valueOf((String)condition.get('code'));
                    weather.temperatureInCelcuis = convertFahrenheitToCelsius(Integer.valueOf(weather.temprature));
                    System.debug('\n\n: ' + location + ' ' + weather.temprature +  ' ' + weather.temperatureInCelcuis);
                } catch (Exception e) {
                    String message = e.getMessage();
                    if(message!=null && message.indexOf('Unauthorized endpoint')>-1)
                      message = 'Remote Site settings missing.';
                    ApexPages.Message msg = new Apexpages.Message(ApexPages.Severity.Error, 'Error. ' + message);
                    ApexPages.addmessage(msg);
                }
            } else {
                ApexPages.Message msg = new Apexpages.Message(ApexPages.Severity.Error, 'Please set the location.');
                ApexPages.addmessage(msg);
            }
        }
        return weather;
    }
    public Integer convertFahrenheitToCelsius(Integer temperature) {
        return Math.round(0.55555555555555555555555555555555555555556 * (temperature - 32));
    }
    //public Integer convertCelsiusToFahrenheit(Integer temperature) {
    //    return Math.round((1.8 * temperature) + 32);
    //}
}