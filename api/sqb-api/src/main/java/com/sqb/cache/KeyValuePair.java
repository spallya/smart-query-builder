package com.sqb.cache;

public class KeyValuePair {

    private String id;

    public KeyValuePair(String id, String value) {
        this.id = id;
        this.value = value;
    }

    private  String value;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
